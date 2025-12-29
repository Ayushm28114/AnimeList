from os import name
from re import search
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ReviewViewSet, WatchlistViewSet, AnimeProxyView

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')
router.register(r'register', RegisterView, basename='register')


urlpatterns = [
    path('', include(router.urls)),
    path('anime/<int:anime_id>/', AnimeProxyView.as_view(), name='anime-detail'),
    path('anime/search/', AnimeProxyView.as_view(), name='anime-search'),
    path('auth/register/', RegisterView.as_view({'post': 'create'}), name='register'),
]