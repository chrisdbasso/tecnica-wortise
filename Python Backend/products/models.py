from django.db import models
from django.utils.translation import gettext_lazy as _

from model_utils.models import UUIDModel
from model_utils.choices import Choices

from apps.nutrients.models import Nutrient
from apps.crops.models import Crop


class Product(UUIDModel):
    PRESENTATIONS = Choices(
        ('liquids', _('Liquids')),
        ('solids', _('Solids')),
    )

    name = models.CharField(_('name'), max_length=128, unique=True)
    grade = models.CharField(_('grade'), max_length=128, null=True, blank=True)
    slug = models.CharField(_('slug'), max_length=8, unique=True)
    presentation = models.CharField(_('presentation'), max_length=32, choices=PRESENTATIONS, default=PRESENTATIONS.liquids)
    recommendation_type = models.CharField(_('recommendation type'), max_length=32, help_text=(_('For what type of recommendation applies, regardless of the presentation of the product')), choices=PRESENTATIONS, blank=True, null=True)
    crops = models.ManyToManyField(Crop, verbose_name=_('crops'), blank=True)
    density = models.DecimalField(_('density'), max_digits=10, decimal_places=4, null=True, blank=True)
    published = models.BooleanField(_('published'), default=True)
    order = models.PositiveIntegerField(_('order'), default=0)

    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class ProductNutrient(UUIDModel):
    nutrient = models.ForeignKey(Nutrient, models.CASCADE, verbose_name=_('nutrient'), related_name='products')
    product = models.ForeignKey(Product, models.CASCADE, verbose_name=_('product'), related_name='nutrients')
    amount = models.DecimalField(_('amount'), max_digits=10, decimal_places=4)

    class Meta:
        unique_together = ['nutrient', 'product']
        verbose_name = _('product nutrient')
        verbose_name_plural = _('product nutrients')

    def __str__(self):
        return str(self.nutrient.name)
