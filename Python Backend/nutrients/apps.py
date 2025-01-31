from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class NutrientsConfig(AppConfig):
    name = 'apps.nutrients'
    verbose_name = _('Nutrients')
