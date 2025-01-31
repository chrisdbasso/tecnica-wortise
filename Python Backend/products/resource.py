from import_export.fields import Field

from core.import_export.resources import UUIDModelResource
from core.import_export.widgets import CachedForeignKeyWidget

from .models import ProductNutrient, Product
from apps.nutrients.models import Nutrient


# Widgets

class NutrientWidget(CachedForeignKeyWidget):
    model = Nutrient
    select_related = []
    prefetch_related = []
    field = 'name'


class ProductWidget(CachedForeignKeyWidget):
    model = Product
    select_related = []
    prefetch_related = []
    field = 'name'


# Resources

class ProductResource(UUIDModelResource):
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'presentation', 'recommendation_type']
        export_order = ['id', 'name', 'slug', 'presentation', 'recommendation_type']


class ProductNutrientResource(UUIDModelResource):
    nutrient = Field(attribute='nutrient', widget=NutrientWidget())
    product = Field(attribute='product', widget=ProductWidget())

    class Meta:
        model = ProductNutrient
        fields = ['id', 'product', 'nutrient', 'amount']
        export_order = ['id', 'product', 'nutrient', 'amount']
