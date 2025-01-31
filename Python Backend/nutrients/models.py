from django.db import models
from django.utils.translation import gettext_lazy as _

from model_utils.models import UUIDModel

from apps.crops.models import Crop


class Nutrient(UUIDModel):
    class NutrientType(models.TextChoices):
        MACRO = 'MACRO', _('Macro')
        MICRO = 'MICRO', _('Micro')

    name = models.CharField(_('name'), max_length=128, unique=True)
    slug = models.CharField(_('slug'), max_length=8, unique=True)
    type = models.CharField(_('type'), max_length=64, choices=NutrientType.choices)
    published = models.BooleanField(_('published'), default=True)
    order = models.PositiveIntegerField(_('order'), default=0)

    class Meta:
        verbose_name = _('nutrient')
        verbose_name_plural = _('nutrients')
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class NutrientRequirement(UUIDModel):
    nutrient = models.ForeignKey(Nutrient, models.CASCADE, verbose_name=_('nutrient'), related_name='requirements')
    crop = models.ForeignKey(Crop, models.CASCADE, verbose_name=_('crop'), related_name='requirements')
    requirement = models.DecimalField(_('requirement'), max_digits=10, decimal_places=4)
    harvest_index = models.DecimalField(_('harvest index'), max_digits=10, decimal_places=4)
    not_required_by_the_crop = models.BooleanField(_('not required by the crop'), help_text=(_('Does not recommend this nutrient for the selected crop')), default=False)

    class Meta:
        verbose_name = _('nutrient requirement')
        verbose_name_plural = _('nutrient requirements')

    def __str__(self):
        return f'{self.nutrient} - {self.crop}'


class NutrientConvertionParameter(UUIDModel):
    name = models.CharField(_('name'), max_length=128, unique=True)
    nutrient = models.ForeignKey(Nutrient, models.CASCADE, verbose_name=_('nutrient'))
    nutrient_from = models.CharField(_('from'), max_length=64, unique=True)
    nutrient_to = models.CharField(_('to'), max_length=64, unique=True)
    factor = models.DecimalField(_('factor'), max_digits=8, decimal_places=5)

    class Meta:
        verbose_name = _('nutrient convertion parameter')
        verbose_name_plural = _('nutrient convertion parameters')

    def __str__(self):
        return self.name


class SoilType(UUIDModel):
    name = models.CharField(_('name'), max_length=128, unique=True)
    multiplier = models.DecimalField(_('multiplier'), max_digits=8, decimal_places=5)

    class Meta:
        verbose_name = _('soil type')
        verbose_name_plural = _('soil types')

    def __str__(self):
        return self.name
