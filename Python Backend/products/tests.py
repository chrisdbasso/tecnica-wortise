from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.nutrients.models import Nutrient

from .models import Product, ProductNutrient


class ProductTests(APITestCase):
    def test_get_products(self):
        # get product list
        nutrient = Nutrient.objects.create(name='Nutrient Test', slug='nt', type='MACRO')
        product = Product.objects.create(
            name='Product Test',
            grade='00-00-00',
            slug='pt',
            presentation=Product.PRESENTATIONS.liquids,
            recommendation_type=Product.PRESENTATIONS.liquids,
        )
        ProductNutrient.objects.create(nutrient=nutrient, product=product, amount=1)
        product_data = {
            'id': str(product.id),
            'name': 'Product Test',
            'grade': '00-00-00',
            'slug': 'pt',
            'presentation': Product.PRESENTATIONS.liquids,
            'recommendation_type': Product.PRESENTATIONS.liquids,
            'density': None,
            'nutrients': [{
                'nutrient': {
                    'id': str(nutrient.id),
                    'name': 'Nutrient Test',
                    'slug': 'nt',
                    'type': 'MACRO',
                },
                'amount': '1.0000',
            }],
        }

        url = reverse('product-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, [product_data])

        # get product
        url = reverse('product-detail', args=[product.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, product_data)
