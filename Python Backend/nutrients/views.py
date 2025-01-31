from rest_framework import viewsets

from .serializers import NutrientSerializer, NutrientRequirementSerializer, NutrientConvertionParameterSerializer, SoilTypeSerializer
from .models import Nutrient, NutrientRequirement, NutrientConvertionParameter, SoilType


class NutrientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Nutrient.objects.filter(published=True)
    serializer_class = NutrientSerializer


class NutrientRequirementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NutrientRequirement.objects.all()
    serializer_class = NutrientRequirementSerializer


class NutrientConvertionParameterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NutrientConvertionParameter.objects.all()
    serializer_class = NutrientConvertionParameterSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        nutrient = self.request.query_params.get('nutrient')
        if nutrient is not None:
            queryset = queryset.filter(nutrient=nutrient)
        return queryset


class SoilTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SoilType.objects.all()
    serializer_class = SoilTypeSerializer
