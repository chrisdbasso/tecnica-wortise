from django.contrib import admin

from core.import_export.admin import ImportExportModelAdmin

from .models import Product, ProductNutrient
from .resource import ProductResource, ProductNutrientResource


@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ['id', 'name', 'grade', 'presentation', 'recommendation_type', 'density', 'order']
    search_fields = [
        'name__unaccent__icontains',
        'presentation__unaccent__icontains',
    ]
    list_editable = ['density']
    list_filter = ['presentation', 'recommendation_type']
    resource_class = ProductResource


@admin.register(ProductNutrient)
class ProductNutrientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ['id', 'nutrient', 'product', 'amount']
    search_fields = [
        'nutrient__name__unaccent__icontains',
        'product__name__unaccent__icontains',
    ]
    list_filter = ['nutrient']
    resource_class = ProductNutrientResource
