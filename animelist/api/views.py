from rest_framework_simplejwt.authentication import JWTAuthentication
from .authentication import CsrfExemptJWTAuthentication
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Review, Watchlist
from .serializers import ReviewSerializer, WatchSerializer, RegisterSerializer
import requests
from django.conf import settings
from rest_framework.views import APIView
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self,request,view,obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user
    

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    authentication_classes = [CsrfExemptJWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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

    def perform_create(self, serializer):
        print("AUTH HEADER:", self.request.headers.get("Authorization"))
        print("USER:", self.request.user)
        serializer.save(user=self.request.user)

class WatchlistViewSet(viewsets.ModelViewSet):
    queryset = Watchlist.objects.all()
    serializer_class = WatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)


class AnimeProxyView(APIView):
    permission_classes = [permissions.AllowAny]
    JIKAN_BASE = "https://api.jikan.moe/v4"


    def get(self, request, anime_id=None):
        if anime_id:
            cache_key = f"anime_details_{anime_id}"
            data = cache.get(cache_key)
            if data is None:
                url = f"{self.JIKAN_BASE}/anime/{anime_id}"
                resp = requests.get(url)
                data = resp.json()
                cache.set(cache_key, data, timeout=60*60)
            return Response(data)

        else:
            q=request.query_params.get('q','')
            page=request.query_params.get('page','1')
            cache_key = f"anime_search_{q}_{page}"
            data = cache.get(cache_key)

            if data is None:
                url = f"{self.JIKAN_BASE}/anime"
                params = {'q':q, 'page':page
                          , 'sfw' : 'true', 'genres_exclude': 'Hentai,Erotica,Ecchi,Adult,Yaoi,Yuri,Harem'
                          }
                resp= requests.get(url, params=params)
                data = resp.json()
                cache.set(cache_key, data, timeout=60*5)

            return Response(data)
        

class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer