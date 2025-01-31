from decimal import Decimal

from apps.products.models import ProductNutrient
from apps.recommendations.recommender.recommender import Recommender

from ..utils import build_recommendation_payload, get_product_nutrient_amount


class RecommenderByLeastNutrient(Recommender):
    def __init__(self, priority_nutrient, least_nutrient, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.least_nutrient = least_nutrient
        self.priority_nutrient = priority_nutrient

    def recommend(self):
        # In this recommendation, we are looking for a product that has more nutrients.
        nutrients = ProductNutrient.objects.all()
        products = self.products
        best_product = products.first()
        for product in products:
            product_nutrients = nutrients.filter(product=product)
            best_product_nutrients = nutrients.filter(product=best_product)
            if len(product_nutrients) >= len(best_product_nutrients):
                product_nutrient_amount = get_product_nutrient_amount(product_nutrients, self.least_nutrient)
                best_product_nutrient_amount = get_product_nutrient_amount(best_product_nutrients, self.least_nutrient)
                if best_product_nutrient_amount and product_nutrient_amount:
                    best_product = product if product_nutrient_amount < best_product_nutrient_amount else best_product

        best_product_nutrients = ProductNutrient.objects.filter(product=best_product)
        required_quantity = Decimal(self.nutrients[self.priority_nutrient])
        multiplier = required_quantity / get_product_nutrient_amount(best_product_nutrients, self.priority_nutrient)
        amount = multiplier * 100

        return build_recommendation_payload(amount, best_product, best_product_nutrients, multiplier)
