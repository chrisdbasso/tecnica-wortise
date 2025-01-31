from django.urls import include, path

from rest_framework import routers

from .views import NutrientViewSet, NutrientRequirementViewSet, NutrientConvertionParameterViewSet, SoilTypeViewSet

router = routers.DefaultRouter()
router.register(r'nutrients', NutrientViewSet)
router.register(r'nutrient-requirements', NutrientRequirementViewSet)
router.register(r'nutrient-convertion-parameters', NutrientConvertionParameterViewSet)
router.register(r'soil-types', SoilTypeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
