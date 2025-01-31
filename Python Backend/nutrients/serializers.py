from rest_framework import serializers

from .models import Nutrient, NutrientRequirement, NutrientConvertionParameter, SoilType


class NutrientRequirementSerializer(serializers.ModelSerializer):
    nutrient = serializers.SerializerMethodField()

    class Meta:
        model = NutrientRequirement
        fields = ['id', 'nutrient', 'crop', 'requirement', 'harvest_index', 'not_required_by_the_crop']
        read_only = fields

    def get_nutrient(self, obj):
        return obj.nutrient.slug


class NutrientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrient
        fields = ['id', 'name', 'slug', 'type']


class NutrientConvertionParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutrientConvertionParameter
        fields = ['id', 'name', 'nutrient_from', 'nutrient_to', 'factor']


class SoilTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilType
        fields = ['id', 'name', 'multiplier']
