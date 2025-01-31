from django.urls import include, path

from rest_framework import routers

from .views import LiquidRecommendationView, SolidRecommendationView, RecommendationsLinkView, CreateRecommendationsLinkView


router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('liquid-recommendations/', LiquidRecommendationView.as_view()),
    path('solid-recommendations/', SolidRecommendationView.as_view()),
    path('recommendations-link/', RecommendationsLinkView.as_view()),
    path('create-recommendations-link/', CreateRecommendationsLinkView.as_view()),
]
