from rest_framework import status
from rest_framework.test import APITestCase


class RecommendationTests(APITestCase):
    fixtures = ['recommendations.json']

    def setUp(self):
        from apps.system.models import RuntimeSettings
        RuntimeSettings.get_solo()

    def test_solid_recommendation(self):
        url = '/api/solid-recommendations/'
        recommendation_data = SOLID_RECOMMENDATION

        response = self.client.post(url, data=NUTRIENTS_REQUEST, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, recommendation_data)

    def test_liquid_recommendation(self):
        url = '/api/liquid-recommendations/'
        recommendation_data = LIQUID_RECOMMENDATION

        response = self.client.post(url, data=NUTRIENTS_REQUEST, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, recommendation_data)

    def test_liquid_recommendation_without_zinc(self):
        url = '/api/liquid-recommendations/'
        recommendation_data = LIQUID_RECOMMENDATION_WITHOUT_ZINC

        response = self.client.post(url, data=NUTRIENTS_REQUEST_WITHOUT_ZINC, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, recommendation_data)

    def test_solid_recommendation_without_zinc(self):
        url = '/api/solid-recommendations/'
        recommendation_data = SOLID_RECOMMENDATION_WITHOUT_ZINC

        response = self.client.post(url, data=NUTRIENTS_REQUEST_WITHOUT_ZINC, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(response.content, recommendation_data)

    def test_liquid_recommendation_without_nitrogen(self):
        url = '/api/liquid-recommendations/'
        response = self.client.post(url, data={'nutrients': {'N': 0, 'P': 24}}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_solid_recommendation_without_phosphorus(self):
        url = '/api/liquid-recommendations/'
        response = self.client.post(url, data={'nutrients': {'N': 120, 'P': 0}}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_with_invalid_nutrient(self):
        url = '/api/liquid-recommendations/'
        response = self.client.post(url, data={'nutrients': {'X': 12}}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


NUTRIENTS_REQUEST = {
    'nutrients': {
        'N': 140,
        'P': 24,
        'S': 12,
        'K': 23,
        'Zn': 1,
    },
}

NUTRIENTS_REQUEST_WITHOUT_ZINC = {
    'nutrients': {
        'N': 140,
        'P': 24,
        'S': 12,
        'K': 23,
        'Zn': 0,
    },
}

LIQUID_RECOMMENDATION = [
    {
        'product': {
            'id': '6268b253-26d3-4443-a4cd-4a6cf9feeeb2',
            'name': 'SolMIX Zn 27 N-5 S-0,4 Zn',
            'grade': '00-00-00',
            'slug': 'SMZN27',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '29.0000',
                },
                {
                    'nutrient': {
                        'id': '47f05cf2-faec-4635-bc4c-2af90c5868ca',
                        'name': 'Zinc',
                        'slug': 'Zn',
                        'type': 'MACRO',
                    },
                    'amount': '0.4000',
                },
                {
                    'nutrient': {
                        'id': 'df48c478-94e1-4c8b-ab79-5bfb931f809f',
                        'name': 'Azufre',
                        'slug': 'S',
                        'type': 'MACRO',
                    },
                    'amount': '2.3000',
                },
            ],
        },
        'amount': 439.0083,
        'multiplier': 4.3901,
        'is_phosphate': False,
    },
    {
        'product': {
            'id': '7f949ccc-35f1-41e3-8c3e-f61208f1e1de',
            'name': 'MAP 12-52',
            'grade': '00-00-00',
            'slug': 'MAP125',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '12.0000',
                },
                {
                    'nutrient': {
                        'id': '229784ab-a232-4287-9923-b1b9bc8623a4',
                        'name': 'Fosforo',
                        'slug': 'P',
                        'type': 'MACRO',
                    },
                    'amount': '22.7000',
                },
            ],
        },
        'amount': 105.7269,
        'multiplier': 1.0573,
        'is_phosphate': True,
    },
]

LIQUID_RECOMMENDATION_WITHOUT_ZINC = [
    {
        'product': {
            'id': 'c4111060-7d57-428f-aa0b-5745a1c1c530',
            'name': 'SolMIX N 30 - S 2,6',
            'grade': '00-00-00',
            'slug': 'SMN30',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': 'df48c478-94e1-4c8b-ab79-5bfb931f809f',
                        'name': 'Azufre',
                        'slug': 'S',
                        'type': 'MACRO',
                    },
                    'amount': '2.6000',
                },
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '30.0000',
                },
            ],
        },
        'amount': 424.3747,
        'multiplier': 4.2437,
        'is_phosphate': False,
    },
    {
        'product': {
            'id': '7f949ccc-35f1-41e3-8c3e-f61208f1e1de',
            'name': 'MAP 12-52',
            'grade': '00-00-00',
            'slug': 'MAP125',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '12.0000',
                },
                {
                    'nutrient': {
                        'id': '229784ab-a232-4287-9923-b1b9bc8623a4',
                        'name': 'Fosforo',
                        'slug': 'P',
                        'type': 'MACRO',
                    },
                    'amount': '22.7000',
                },
            ],
        },
        'amount': 105.7269,
        'multiplier': 1.0573,
        'is_phosphate': True,
    },
]

SOLID_RECOMMENDATION_WITHOUT_ZINC = [
    {
        'product': {
            'id': '3ad978f4-8ac9-4895-83d2-ff76fe758553',
            'name': 'ME S9',
            'grade': '00-00-00',
            'slug': 'MES9',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': 'df48c478-94e1-4c8b-ab79-5bfb931f809f',
                        'name': 'Azufre',
                        'slug': 'S',
                        'type': 'MACRO',
                    },
                    'amount': '9.0000',
                },
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '10.0000',
                },
                {
                    'nutrient': {
                        'id': '229784ab-a232-4287-9923-b1b9bc8623a4',
                        'name': 'Fosforo',
                        'slug': 'P',
                        'type': 'MACRO',
                    },
                    'amount': '20.1000',
                },
            ],
        },
        'amount': 119.403,
        'multiplier': 1.194,
        'is_phosphate': True,
    },
    {
        'product': {
            'id': '3422c096-d390-4ee6-8cfd-b66bf7455e76',
            'name': 'Urea Granulada',
            'grade': '00-00-00',
            'slug': 'UG',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '46.0000',
                },
            ],
        },
        'amount': 278.3913,
        'multiplier': 2.7839,
        'is_phosphate': False,
    },
]

SOLID_RECOMMENDATION = [
    {
        'product': {
            'id': '80e50c9e-b49c-45cc-8011-6eeaa258839a',
            'name': 'ME SZ',
            'grade': '00-00-00',
            'slug': 'MESZ',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '47f05cf2-faec-4635-bc4c-2af90c5868ca',
                        'name': 'Zinc',
                        'slug': 'Zn',
                        'type': 'MACRO',
                    },
                    'amount': '1.0000',
                },
                {
                    'nutrient': {
                        'id': 'df48c478-94e1-4c8b-ab79-5bfb931f809f',
                        'name': 'Azufre',
                        'slug': 'S',
                        'type': 'MACRO',
                    },
                    'amount': '10.0000',
                },
                {
                    'nutrient': {
                        'id': '229784ab-a232-4287-9923-b1b9bc8623a4',
                        'name': 'Fosforo',
                        'slug': 'P',
                        'type': 'MACRO',
                    },
                    'amount': '17.4000',
                },
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '12.0000',
                },
            ],
        },
        'amount': 137.931,
        'multiplier': 1.3793,
        'is_phosphate': True,
    },
    {
        'product': {
            'id': '3422c096-d390-4ee6-8cfd-b66bf7455e76',
            'name': 'Urea Granulada',
            'grade': '00-00-00',
            'slug': 'UG',
            'density': None,
            'nutrients': [
                {
                    'nutrient': {
                        'id': '8e15f672-824e-4d02-9abd-510edb3796a8',
                        'name': 'Nitrogeno',
                        'slug': 'N',
                        'type': 'MACRO',
                    },
                    'amount': '46.0000',
                },
            ],
        },
        'amount': 268.3661,
        'multiplier': 2.6837,
        'is_phosphate': False,
    },
]
