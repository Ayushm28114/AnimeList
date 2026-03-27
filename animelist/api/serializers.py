from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Review, Watchlist, ReviewReply, ReviewVote, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ReviewReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ReviewReply
        fields = ['id', 'review', 'user', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ReviewVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewVote
        fields = ['id', 'review', 'vote_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = ReviewReplySerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    dislikes_count = serializers.IntegerField(read_only=True)
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'anime_id', 'anime_title', 'anime_image', 'rating', 'comment', 
                  'created_at', 'updated_at', 'replies', 'likes_count', 'dislikes_count', 'user_vote']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'replies', 'likes_count', 'dislikes_count']

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = obj.votes.filter(user=request.user).first()
            return vote.vote_type if vote else None
        return None


class WatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'anime_id', 'anime_title', 'anime_image', 'status', 'is_favorite', 'added_at', 'updated_at']
        read_only_fields = ['id', 'added_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model=User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password' : {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        # Create user profile for sharing feature
        UserProfile.objects.create(user=user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'share_code', 'is_watchlist_public', 'created_at', 'updated_at']
        read_only_fields = ['id', 'share_code', 'created_at', 'updated_at']


class SharedWatchlistSerializer(serializers.ModelSerializer):
    """Serializer for public shared watchlist (limited fields)"""
    class Meta:
        model = Watchlist
        fields = ['anime_id', 'anime_title', 'anime_image', 'status', 'is_favorite', 'added_at']

        fields=['anime_id', 'anime_field_projection',]