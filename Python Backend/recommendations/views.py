from django.conf import settings
from django.shortcuts import redirect
from rest_framework import views
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from .models import RecommendationLink

from .recommender.recommender_by_nutrient import RecommenderByNutrient
from .recommender.recommender import Recommender
from .recommender.recommender_by_optimal_product import RecommenderByOptimalProduct
from .utils import subtract_completed_nutrients

from apps.products.models import Product


class LiquidRecommendationView(views.APIView):
    def post(self, request):
        nutrients = request.data['nutrients']
        crop = request.data.get('crop')

        recommender = Recommender(nutrients, Product.PRESENTATIONS.liquids)
        if not recommender.validate():
            raise ValidationError(_('The "nutrients" parameter is not valid.'))

        if not (nutrients.get('P') and nutrients.get('P') > 0):
            raise ValidationError(_('The nutrient P is required.'))

        if not (nutrients.get('N') and nutrients.get('N') > 0):
            raise ValidationError(_('The nutrient N is required.'))

        recommendations = []

        # For recommendation of liquids, prioritize phosphorus
        recommendation_by_nutrient = RecommenderByNutrient('P', nutrients, Product.PRESENTATIONS.liquids, crop, is_phosphate=True).recommend()
        subtract_completed_nutrients(nutrients, recommendation_by_nutrient)

        # Then the most optimal prioritizing nitrogen
        recommendation_by_optimal_product = RecommenderByOptimalProduct('N', nutrients, Product.PRESENTATIONS.liquids, crop, 'P').recommend()
        subtract_completed_nutrients(nutrients, recommendation_by_optimal_product)

        recommendations.append(recommendation_by_optimal_product)
        recommendations.append(recommendation_by_nutrient)

        return Response(recommendations)


class SolidRecommendationView(views.APIView):
    def post(self, request):
        nutrients = request.data['nutrients']
        crop = request.data.get('crop')

        if not Recommender(nutrients, Product.PRESENTATIONS.solids).validate():
            raise ValidationError(_('The "nutrients" parameter is not valid.'))

        if not (nutrients.get('P') and nutrients.get('P') > 0):
            raise ValidationError(_('The nutrient P is required.'))

        recommendations = []

        # For solid recommendation, the most optimal product prioritizing phosphorous
        recommendation = RecommenderByOptimalProduct('P', nutrients, Product.PRESENTATIONS.solids, crop, is_phosphate=True).recommend()
        if recommendation:
            subtract_completed_nutrients(nutrients, recommendation)
            recommendations.append(recommendation)

        # Then fill in the rest with nitrogen
        if nutrients.get('N') and nutrients.get('N') > 0:
            recommendation = RecommenderByNutrient('N', nutrients, Product.PRESENTATIONS.solids, crop).recommend()
            subtract_completed_nutrients(nutrients, recommendation)
            recommendations.append(recommendation)

        return Response(recommendations)


class RecommendationsLinkView(views.APIView):
    def get(self, request):
        link = RecommendationLink.objects.get(slug=request.query_params.get('q'))
        return redirect(f'/recommendations/{link.url}')


class CreateRecommendationsLinkView(views.APIView):
    def post(self, request):
        link = RecommendationLink.objects.create(url=request.data.get('url').replace(f'{settings.SITE_URL}/recommendations/', ''))
        return Response({'url': f'{settings.SITE_URL}/api/recommendations-link/?q={link.slug}'})
