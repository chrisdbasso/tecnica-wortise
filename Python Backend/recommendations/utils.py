from decimal import Decimal

from apps.products.serializers import ProductNutrientSerializer


def get_product_nutrient_amount(product_nutrients, nutrient):
    # Product and nutrient are unique_together, that's why we always take the first
    if product_nutrients.filter(nutrient__slug__in=[nutrient]).exists():
        return product_nutrients.filter(nutrient__slug__in=[nutrient]).first().amount
    else:
        return 0


def nutrient_exists(nutrients_a, nutrients_b, nutrient):
    return nutrients_a.filter(nutrient__slug__in=[nutrient]).exists() and nutrients_b.filter(nutrient__slug__in=[nutrient]).exists()


def get_nutrient_difference(product_nutrients, multiplier, required_nutrient, nutrient):
    if product_nutrients.filter(nutrient__slug__in=[nutrient]).exists():
        return abs(Decimal(product_nutrients.filter(nutrient__slug__in=[nutrient]).first().amount * multiplier) - Decimal(required_nutrient))


def subtract_completed_nutrients(nutrients, recommendation):
    for product_nutrient in recommendation['product']['nutrients']:
        multiplier = Decimal(recommendation['multiplier'])
        amount = Decimal(product_nutrient['amount'])
        amount_to_subtract = Decimal(nutrients[product_nutrient['nutrient']['slug']]) - round(Decimal((multiplier * amount)), 4)
        nutrients[product_nutrient['nutrient']['slug']] = amount_to_subtract if amount_to_subtract > 0 else 0


def build_recommendation_payload(amount, best_product, best_product_nutrients, multiplier, is_phosphate=False):
    return {
        'product': {
            'id': best_product.id,
            'name': best_product.name,
            'grade': best_product.grade,
            'slug': best_product.slug,
            'density': best_product.density,
            'nutrients': [
                ProductNutrientSerializer(product_nutrient).data
                for product_nutrient in best_product_nutrients
            ],
        },
        'amount': round(amount, 4),
        'multiplier': round(multiplier, 4),
        'is_phosphate': is_phosphate,
    }


def calculate_error_percentage(contributed_nutrient, required_nutrient, nutrient, nutrient_weights):
    return Decimal(abs(Decimal(contributed_nutrient) - Decimal(required_nutrient))) / Decimal((required_nutrient if required_nutrient else 1)) * 100 * Decimal(nutrient_weights.get(nutrient, 0))


def calculate_required_amount(product, nutrients, priority_nutrient):
    required_quantity = Decimal(nutrients.get(priority_nutrient, 0))
    if get_product_nutrient_amount(product.nutrients, priority_nutrient) > 0:
        multiplier = required_quantity / get_product_nutrient_amount(product.nutrients, priority_nutrient)
        return multiplier * 100
    return 0


def calculate_acumulate_error_product(product, product_acumulate_error, product_amount, nutrient, required_quantity, nutrient_weights):
    for product_nutrient in product.nutrients.values('amount', 'nutrient__slug'):
        if product_nutrient.get('nutrient__slug') == nutrient:
            contributed_nutrient = Decimal(product_amount / 100) * Decimal(product_nutrient.get('amount'))
            product_acumulate_error += calculate_error_percentage(contributed_nutrient, required_quantity, nutrient, nutrient_weights)

    if nutrient not in product.nutrients.values_list('nutrient__slug', flat=True):
        product_acumulate_error += calculate_error_percentage(0, required_quantity, nutrient, nutrient_weights)

    return product_acumulate_error
