from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Review, Watchlist

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id','user', 'anime_id', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class WatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Watchlist
        fields = ['user', 'anime_id', 'status', 'added_at']


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
        return user