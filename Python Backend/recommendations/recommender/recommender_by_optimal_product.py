from decimal import Decimal

from apps.products.models import ProductNutrient
from apps.recommendations.recommender.recommender import Recommender

from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from ..utils import (
    build_recommendation_payload,
    calculate_required_amount,
    calculate_acumulate_error_product,
)
from ...crops.models import Crop
from ...system.models import RuntimeSettings


class RecommenderByOptimalProduct(Recommender):
    def __init__(self, priority_nutrient, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.priority_nutrient = priority_nutrient

    def recommend(self):
        nutrients_weights = self.get_nutrients_weights()
        products = self.products

        if not self.nutrients.get('N', None) and self.nutrients.get('Zn', None) > 0:
            products = self.exclude_products_without_zinc(products)

        candidates_product_list = self.get_candidates_products_order_by_error(nutrients_weights, products)

        if not self.nutrients.get('N', None):
            candidates_product_list = self.exclude_products_that_exceed_nitrogen(candidates_product_list)

        best_product = candidates_product_list[0]

        if self.is_phosphate:
            best_product = self.select_another_best_product_when_exceed_phospathe(best_product, candidates_product_list)

        product_amount = best_product.get('amount')
        best_product = best_product.get('product')
        best_product_nutrients = ProductNutrient.objects.filter(product=best_product)
        return build_recommendation_payload(product_amount, best_product, best_product_nutrients, product_amount / 100, is_phosphate=self.is_phosphate)

    def select_another_best_product_when_exceed_phospathe(self, best_product, candidates_product_list):
        if self.crop:
            crop = Crop.objects.get(slug=self.crop)
            max_phosphate_product_amount = crop.max_phosphate_product_amount
        else:
            max_phosphate_product_amount = RuntimeSettings.objects.get().max_phosphate_product_amount_default
        max_phospating_decision_error = RuntimeSettings.objects.get().max_phospating_decision_error
        for product in candidates_product_list:
            if product.get('amount') < max_phosphate_product_amount and abs(product.get('error') - best_product.get('error')) < max_phospating_decision_error:
                best_product = product
                break
        return best_product

    def exclude_products_that_exceed_nitrogen(self, candidates_product_list):
        config = RuntimeSettings.objects.get()
        candidates_product_list_filtered = []
        for product in candidates_product_list:
            product_nutrients = ProductNutrient.objects.filter(product=product.get('product'), nutrient__slug='N')
            multiplier = product.get('amount') / 100
            for product_nutrient in product_nutrients:
                if not (Decimal(product_nutrient.amount) * Decimal(multiplier)) > Decimal(config.max_nitrogen_amount_when_nitrogen_is_not_required):
                    candidates_product_list_filtered.append(product)
        candidates_product_list = candidates_product_list_filtered
        return candidates_product_list

    def get_candidates_products_order_by_error(self, nutrients_weights, products):
        candidates_product_list = []
        for product in products:
            product_amount = calculate_required_amount(product, self.nutrients, self.priority_nutrient)
            product_acumulate_error = 0
            for nutrient in self.nutrients:
                required_quantity = self.nutrients.get(nutrient)
                product_acumulate_error = calculate_acumulate_error_product(product, product_acumulate_error, product_amount, nutrient, required_quantity, nutrients_weights)
            candidates_product_list.append({'product': product, 'error': product_acumulate_error, 'amount': product_amount})
        if not candidates_product_list:
            raise ValidationError(_('There are no products to recommend'))
        candidates_product_list.sort(key=lambda p: p.get('error'))
        return candidates_product_list

    def exclude_products_without_zinc(self, products):
        for product in products:
            nutrients = product.nutrients.values_list('nutrient__slug', flat=True)
            if 'Zn' not in nutrients:
                products = products.exclude(id=product.id)
        return products

    def get_nutrients_weights(self):
        config = RuntimeSettings.objects.get()
        if not self.nutrients.get('N', None):
            return {
                'N': config.nitrogen_weight_when_nitrogen_is_not_required,
                'P': config.phosphorus_weight_when_nitrogen_is_not_required,
                'S': config.sulfur_weight_when_nitrogen_is_not_required,
                'Zn': config.zinc_weight_when_nitrogen_is_not_required,
            }
        return {
            'N': config.nitrogen_weight,
            'P': config.phosphorus_weight,
            'S': config.sulfur_weight,
            'Zn': config.zinc_weight,
        }
