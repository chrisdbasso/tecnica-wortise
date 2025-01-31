from __future__ import annotations

from abc import ABC

from apps.nutrients.models import Nutrient
from apps.products.models import Product


class Recommender(ABC):
    def __init__(self, nutrients, recommendation_type, crop=None, skipped_nutrient=None, is_phosphate=False):
        if skipped_nutrient:
            self.nutrients = dict(filter(lambda elem: elem[0] != skipped_nutrient, nutrients.items()))
        else:
            self.nutrients = dict(nutrients.items())
        self.recommendation_type = recommendation_type
        self.crop = crop
        self.is_phosphate = is_phosphate
        self.products = Product.objects.prefetch_related('nutrients').filter(published=True, recommendation_type=self.recommendation_type).distinct()
        if self.crop:
            self.products = self.products.filter(crops_products__slug=self.crop)

    def validate(self):
        nutrients_keys = self.nutrients.keys()

        if not nutrients_keys:
            return False

        validate = True
        for nutrient in nutrients_keys:
            validate = Nutrient.objects.filter(slug=nutrient).exists() and validate

        return validate

    def recommend(self):
        pass
