from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Review, Watchlist, ReviewReply, ReviewVote, UserProfile
from .serializers import ReviewSerializer, WatchSerializer, RegisterSerializer, ReviewReplySerializer, ReviewVoteSerializer, UserProfileSerializer, SharedWatchlistSerializer
import requests
from django.conf import settings
from rest_framework.views import APIView
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self,request,view,obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user
    

class ReviewViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        qs = Review.objects.all()
        anime_id = self.request.query_params.get('anime_id')
        user_id = self.request.query_params.get('user_id')
        text = self.request.query_params.get('text')

        if anime_id:
            qs = qs.filter(anime_id=anime_id)
        if user_id:
            qs = qs.filter(user_id=user_id)
        if text:
            qs = qs.filter(text__icontains=text)

        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        print("AUTH HEADER:", self.request.headers.get("Authorization"))
        print("USER:", self.request.user)
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def vote(self, request, pk=None):
        """Like or dislike a review"""
        review = self.get_object()
        vote_type = request.data.get('vote_type')
        
        if vote_type not in ['like', 'dislike']:
            return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already voted
        existing_vote = ReviewVote.objects.filter(review=review, user=request.user).first()
        
        if existing_vote:
            if existing_vote.vote_type == vote_type:
                # Same vote - remove it (toggle off)
                existing_vote.delete()
                return Response({'message': 'Vote removed', 'action': 'removed'})
            else:
                # Different vote - update it
                existing_vote.vote_type = vote_type
                existing_vote.save()
                return Response({'message': 'Vote updated', 'action': 'updated', 'vote_type': vote_type})
        else:
            # New vote
            ReviewVote.objects.create(review=review, user=request.user, vote_type=vote_type)
            return Response({'message': 'Vote added', 'action': 'added', 'vote_type': vote_type})

    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def replies(self, request, pk=None):
        """Get or create replies for a review"""
        review = self.get_object()
        
        if request.method == 'GET':
            replies = review.replies.all()
            serializer = ReviewReplySerializer(replies, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = ReviewReplySerializer(data={'review': review.id, 'comment': request.data.get('comment')})
            if serializer.is_valid():
                serializer.save(user=request.user, review=review)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewReplyViewSet(viewsets.ModelViewSet):
    """ViewSet for managing review replies"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ReviewReplySerializer
    queryset = ReviewReply.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        reply = self.get_object()
        if reply.user != request.user:
            raise PermissionDenied("You can only delete your own replies")
        return super().destroy(request, *args, **kwargs)

class WatchlistViewSet(viewsets.ModelViewSet):
    queryset = Watchlist.objects.all()
    serializer_class = WatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Override create to handle duplicate entries gracefully"""
        anime_id = request.data.get('anime_id')
        
        # Check if this anime is already in user's watchlist
        existing = Watchlist.objects.filter(
            user=request.user, 
            anime_id=anime_id
        ).first()
        
        if existing:
            # Update the existing entry instead of creating a duplicate
            existing.status = request.data.get('status', existing.status)
            existing.anime_title = request.data.get('anime_title', existing.anime_title)
            existing.anime_image = request.data.get('anime_image', existing.anime_image)
            existing.save()
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new entry
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'post'], url_path='sharing')
    def sharing(self, request):
        """Get or update sharing settings"""
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            is_public = request.data.get('is_public', False)
            profile.is_watchlist_public = is_public
            
            # Generate share code if enabling sharing and no code exists
            if is_public and not profile.share_code:
                profile.generate_share_code()
            
            profile.save()
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='regenerate-code')
    def regenerate_code(self, request):
        """Regenerate share code"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.generate_share_code()
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class SharedWatchlistView(APIView):
    """Public endpoint to view shared watchlists"""
    permission_classes = [AllowAny]

    def get(self, request, share_code):
        try:
            profile = get_object_or_404(UserProfile, share_code=share_code)
            
            if not profile.is_watchlist_public:
                return Response(
                    {'error': 'This watchlist is not public'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            watchlist = Watchlist.objects.filter(user=profile.user)
            serializer = SharedWatchlistSerializer(watchlist, many=True)
            
            return Response({
                'username': profile.user.username,
                'watchlist': serializer.data,
                'stats': {
                    'total': watchlist.count(),
                    'watching': watchlist.filter(status='W').count(),
                    'completed': watchlist.filter(status='C').count(),
                    'plan_to_watch': watchlist.filter(status='PW').count(),
                    'on_hold': watchlist.filter(status='OH').count(),
                    'dropped': watchlist.filter(status='D').count(),
                    'favorites': watchlist.filter(is_favorite=True).count(),
                }
            })
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Watchlist not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class AnimeProxyView(APIView):
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"


    def get(self, request, anime_id=None):
        if anime_id:
            cache_key = f"anime_details_{anime_id}"
            data = cache.get(cache_key)
            if data is None:
                url = f"{self.JIKAN_BASE}/anime/{anime_id}"
                try:
                    resp = requests.get(url, timeout=10)
                    data = resp.json()
                    
                    # Only cache successful responses that have 'data' field
                    if resp.status_code == 200 and 'data' in data:
                        cache.set(cache_key, data, timeout=60*60)
                    elif resp.status_code == 404:
                        return Response({'error': 'Anime not found'}, status=404)
                    elif resp.status_code == 429:
                        return Response({'error': 'Rate limited, please try again'}, status=429)
                    else:
                        # Don't cache error responses - return error
                        return Response({'error': 'Failed to fetch anime'}, status=502)
                except requests.exceptions.RequestException:
                    return Response({'error': 'Failed to connect to anime database'}, status=503)
            return Response(data)

        else:
            # Advanced search with filters
            q = request.query_params.get('q', '')
            page = request.query_params.get('page', '1')
            limit = request.query_params.get('limit', '25')  # Max 25 per Jikan API
            
            # Advanced filter parameters
            min_score = request.query_params.get('min_score', '')
            anime_type = request.query_params.get('type', '')
            anime_status = request.query_params.get('status', '')
            rating = request.query_params.get('rating', '')
            start_year = request.query_params.get('start_year', '')
            order_by = request.query_params.get('order_by', '')
            sort = request.query_params.get('sort', 'desc')
            
            # Build cache key with all params
            cache_key = f"anime_search_{q}_{page}_{limit}_{min_score}_{anime_type}_{anime_status}_{rating}_{start_year}_{order_by}_{sort}"
            data = cache.get(cache_key)

            if data is None:
                url = f"{self.JIKAN_BASE}/anime"
                params = {
                    'q': q, 
                    'page': page,
                    'limit': limit,  # Add limit parameter
                    'sfw': 'true', 
                    'genres_exclude': '12,26,28,58,65,81'  # Exclude adult genres by ID
                }
                
                # Add optional filter params
                if min_score:
                    params['min_score'] = min_score
                if anime_type:
                    params['type'] = anime_type
                if anime_status:
                    params['status'] = anime_status
                if rating:
                    params['rating'] = rating
                if start_year:
                    params['start_date'] = f"{start_year}-01-01"
                if order_by:
                    params['order_by'] = order_by
                    params['sort'] = sort
                
                try:
                    resp = requests.get(url, params=params, timeout=10)
                    data = resp.json()
                    if resp.status_code == 200:
                        cache.set(cache_key, data, timeout=60*5)
                    elif resp.status_code == 429:
                        return Response({'error': 'Rate limited'}, status=429)
                except requests.exceptions.RequestException:
                    return Response({'error': 'Failed to search anime'}, status=503)

            return Response(data)


class AnimeCharactersView(APIView):
    """Fetch characters and voice actors for an anime"""
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"

    def get(self, request, anime_id):
        cache_key = f"anime_characters_{anime_id}"
        data = cache.get(cache_key)
        if data is None:
            url = f"{self.JIKAN_BASE}/anime/{anime_id}/characters"
            try:
                resp = requests.get(url, timeout=10)
                data = resp.json()
                if resp.status_code == 200 and 'data' in data:
                    cache.set(cache_key, data, timeout=60*60*24)
                elif resp.status_code == 429:
                    return Response({'error': 'Rate limited'}, status=429)
                else:
                    return Response({'data': []})  # Return empty list on error
            except requests.exceptions.RequestException:
                return Response({'data': []})
        return Response(data)


class AnimeStaffView(APIView):
    """Fetch staff members for an anime"""
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"

    def get(self, request, anime_id):
        cache_key = f"anime_staff_{anime_id}"
        data = cache.get(cache_key)
        if data is None:
            url = f"{self.JIKAN_BASE}/anime/{anime_id}/staff"
            try:
                resp = requests.get(url, timeout=10)
                data = resp.json()
                if resp.status_code == 200 and 'data' in data:
                    cache.set(cache_key, data, timeout=60*60*24)
                elif resp.status_code == 429:
                    return Response({'error': 'Rate limited'}, status=429)
                else:
                    return Response({'data': []})
            except requests.exceptions.RequestException:
                return Response({'data': []})
        return Response(data)


class AnimeRecommendationsView(APIView):
    """Fetch recommendations for an anime"""
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"

    def get(self, request, anime_id):
        cache_key = f"anime_recommendations_{anime_id}"
        data = cache.get(cache_key)
        if data is None:
            url = f"{self.JIKAN_BASE}/anime/{anime_id}/recommendations"
            try:
                resp = requests.get(url, timeout=10)
                data = resp.json()
                if resp.status_code == 200 and 'data' in data:
                    cache.set(cache_key, data, timeout=60*60*24)
                elif resp.status_code == 429:
                    return Response({'error': 'Rate limited'}, status=429)
                else:
                    return Response({'data': []})
            except requests.exceptions.RequestException:
                return Response({'data': []})
        return Response(data)


class AnimeRelationsView(APIView):
    """Fetch related anime"""
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"

    def get(self, request, anime_id):
        cache_key = f"anime_relations_{anime_id}"
        data = cache.get(cache_key)
        if data is None:
            url = f"{self.JIKAN_BASE}/anime/{anime_id}/relations"
            try:
                resp = requests.get(url, timeout=10)
                data = resp.json()
                if resp.status_code == 200 and 'data' in data:
                    cache.set(cache_key, data, timeout=60*60*24)
                elif resp.status_code == 429:
                    return Response({'error': 'Rate limited'}, status=429)
                else:
                    return Response({'data': []})
            except requests.exceptions.RequestException:
                return Response({'data': []})
        return Response(data)


class AnimeStatisticsView(APIView):
    """Fetch statistics for an anime"""
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"

    def get(self, request, anime_id):
        cache_key = f"anime_statistics_{anime_id}"
        data = cache.get(cache_key)
        if data is None:
            url = f"{self.JIKAN_BASE}/anime/{anime_id}/statistics"
            try:
                resp = requests.get(url, timeout=10)
                data = resp.json()
                if resp.status_code == 200 and 'data' in data:
                    cache.set(cache_key, data, timeout=60*60*24)
                elif resp.status_code == 429:
                    return Response({'error': 'Rate limited'}, status=429)
                else:
                    return Response({'data': {}})
            except requests.exceptions.RequestException:
                return Response({'data': {}})
        return Response(data)
        

class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer