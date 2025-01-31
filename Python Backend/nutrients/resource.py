from import_export.fields import Field

from core.import_export.resources import UUIDModelResource
from core.import_export.widgets import CachedForeignKeyWidget

from .models import Nutrient, NutrientRequirement, NutrientConvertionParameter
from apps.crops.models import Crop


# Widgets


class CropWidget(CachedForeignKeyWidget):
    model = Crop
    select_related = []
    prefetch_related = []
    field = 'name'


class NutrientWidget(CachedForeignKeyWidget):
    model = Nutrient
    select_related = []
    prefetch_related = []
    field = 'name'


# Resources


class NutrientRequirementResource(UUIDModelResource):
    nutrient = Field(attribute='nutrient', widget=NutrientWidget())
    crop = Field(attribute='crop', widget=CropWidget())

    class Meta:
        model = NutrientRequirement
        fields = ['id', 'nutrient', 'crop', 'requirement', 'harvest_index']
        export_order = ['id', 'nutrient', 'crop', 'requirement', 'harvest_index']


class NutrientConvertionParameterResource(UUIDModelResource):
    nutrient = Field(attribute='nutrient', widget=NutrientWidget())

    class Meta:
        model = NutrientConvertionParameter
        fields = ['id', 'name', 'nutrient', 'nutrient_from', 'nutrient_to', 'factor']
