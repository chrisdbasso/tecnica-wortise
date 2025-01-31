from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.crops.models import Crop

from .models import Nutrient, NutrientRequirement, NutrientConvertionParameter


class NutrientTests(APITestCase):
    def test_get_nutrients(self):
        # get nutrient list
        nutrient = Nutrient.objects.create(name='Nutrient Test', slug='nt', type='MACRO')
        url = reverse('nutrient-list')
        nutrient_data = {
            'id': str(nutrient.id),
            'name': 'Nutrient Test',
            'slug': 'nt',
            'type': 'MACRO',
        }

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, [nutrient_data])

        # get nutrient
        url = reverse('nutrient-detail', args=[nutrient.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, nutrient_data)


class NutrientRequirementTests(APITestCase):
    def test_get_nutrient_requirements(self):
        # get nutrient requirement list
        crop = Crop.objects.create(name='Crop Test', slug='ct')
        nutrient = Nutrient.objects.create(name='Nutrient Test', slug='nt', type='MACRO')
        nutrient_requirement = NutrientRequirement.objects.create(nutrient=nutrient, crop=crop, requirement=1, harvest_index=1)
        url = reverse('nutrientrequirement-list')
        nutrient_requirement_data = {
            'id': str(nutrient_requirement.id),
            'nutrient': 'nt',
            'crop': str(crop.id),
            'requirement': '1.0000',
            'harvest_index': '1.0000',
            'not_required_by_the_crop': False,
        }

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, [nutrient_requirement_data])

        # get nutrient requirement
        url = reverse('nutrientrequirement-detail', args=[nutrient_requirement.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, nutrient_requirement_data)


class NutrientConvertionParameterTests(APITestCase):
    def test_get_nutrient_convertion_parameters(self):
        # get nutrient convertion parameters list
        nutrient = Nutrient.objects.create(name='Nutrient Test', slug='nt', type='MACRO')
        nutrient_convertion_parameter = NutrientConvertionParameter.objects.create(name='de P a PA', nutrient=nutrient, nutrient_from='P', nutrient_to='PA', factor=0.25)
        url = reverse('nutrientconvertionparameter-list')
        nutrient_convertion_parameter_data = {
            'id': str(nutrient_convertion_parameter.id),
            'name': 'de P a PA',
            'nutrient_from': 'P',
            'nutrient_to': 'PA',
            'factor': '0.25000',
        }

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, [nutrient_convertion_parameter_data])

        # get nutrient convertion parameter
        url = reverse('nutrientconvertionparameter-detail', args=[nutrient_convertion_parameter.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, nutrient_convertion_parameter_data)
