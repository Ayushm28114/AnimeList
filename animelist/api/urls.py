from os import name
from re import search
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ReviewViewSet, WatchlistViewSet, AnimeProxyView, AnimeCharactersView, AnimeStaffView, AnimeRecommendationsView, AnimeRelationsView, AnimeStatisticsView, ReviewReplyViewSet

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'review-replies', ReviewReplyViewSet, basename='review-reply')
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')
router.register(r'register', RegisterView, basename='register')


urlpatterns = [
    path('', include(router.urls)),
    path('anime/<int:anime_id>/', AnimeProxyView.as_view(), name='anime-detail'),
    path('anime/<int:anime_id>/characters/', AnimeCharactersView.as_view(), name='anime-characters'),
    path('anime/<int:anime_id>/staff/', AnimeStaffView.as_view(), name='anime-staff'),
    path('anime/<int:anime_id>/recommendations/', AnimeRecommendationsView.as_view(), name='anime-recommendations'),
    path('anime/<int:anime_id>/relations/', AnimeRelationsView.as_view(), name='anime-relations'),
    path('anime/<int:anime_id>/statistics/', AnimeStatisticsView.as_view(), name='anime-statistics'),
    path('anime/search/', AnimeProxyView.as_view(), name='anime-search'),
    path('auth/register/', RegisterView.as_view({'post': 'create'}), name='register'),
]