from django.contrib import admin

from core.import_export.admin import ImportExportModelAdmin

from .models import Nutrient, NutrientRequirement, NutrientConvertionParameter, SoilType
from .resource import NutrientRequirementResource, NutrientConvertionParameterResource


@admin.register(Nutrient)
class NutrientAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'type']
    search_fields = ['name__unaccent__icontains']
    list_filter = ['type']


@admin.register(NutrientRequirement)
class NutrientRequirementAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ['id', 'nutrient', 'crop', 'requirement', 'harvest_index']
    search_fields = [
        'nutrient__name__unaccent__icontains',
        'nutrient__name__unaccent__icontains',
        'crop__name__unaccent__icontains',
    ]
    list_filter = ['crop', 'nutrient']
    resource_class = NutrientRequirementResource


@admin.register(NutrientConvertionParameter)
class NutrientConvertionParameterAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'factor']
    search_fields = ['name__unaccent__icontains']
    resource_class = NutrientConvertionParameterResource


@admin.register(SoilType)
class SoilTypeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'multiplier']
    search_fields = ['name__unaccent__icontains']
