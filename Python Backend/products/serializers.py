from rest_framework import serializers

from .models import ProductNutrient, Product
from ..nutrients.serializers import NutrientSerializer


class ProductNutrientSerializer(serializers.ModelSerializer):
    nutrient = NutrientSerializer()

    class Meta:
        model = ProductNutrient
        fields = ['nutrient', 'amount']


class ProductSerializer(serializers.ModelSerializer):
    nutrients = ProductNutrientSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'presentation', 'recommendation_type', 'density', 'nutrients', 'grade']
        read_only = fields
