from rest_framework import viewsets

from .serializers import ProductSerializer
from .models import Product


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(published=True)
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        crop = self.request.query_params.get('crop')
        if crop is not None:
            queryset = queryset.filter(crops_products__slug=crop)
        return queryset
