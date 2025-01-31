from decimal import Decimal

from apps.products.models import ProductNutrient
from apps.recommendations.recommender.recommender import Recommender

from ..utils import build_recommendation_payload, get_product_nutrient_amount
from ...crops.models import Crop


class RecommenderByNutrient(Recommender):
    def __init__(self, nutrient, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.nutrient = nutrient

    def recommend(self):
        # In this recommendation, we look for a product that provides more of the nutrient
        nutrients_keys = self.nutrients.keys()
        nutrients = ProductNutrient.objects.filter(nutrient__slug__in=[*nutrients_keys])

        products = self.products
        products = products.filter(nutrients__in=nutrients.filter(nutrient__slug__in=[self.nutrient])).order_by('-nutrients__amount')

        if self.crop and products.filter(crops__in=Crop.objects.filter(slug=self.crop)).exists():
            products = products.filter(crops__in=Crop.objects.filter(slug=self.crop))

        # Product and nutrient are unique_together, that's why we always take the first
        best_product = products.first()
        best_product_nutrients = ProductNutrient.objects.filter(product=best_product)

        required_quantity = Decimal(self.nutrients[self.nutrient])
        multiplier = required_quantity / get_product_nutrient_amount(best_product_nutrients, self.nutrient)
        amount = multiplier * 100

        return build_recommendation_payload(amount, best_product, best_product_nutrients, multiplier, is_phosphate=self.is_phosphate)
