from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class RecommendationsConfig(AppConfig):
    name = 'apps.recommendations'
    verbose_name = _('Recommendations')
