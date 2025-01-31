from uuid import uuid4

from django.db import models
from django.utils.translation import gettext_lazy as _

from model_utils.models import UUIDModel


class RecommendationLink(UUIDModel):
    url = models.TextField(_('url'))
    slug = models.CharField(_('slug'), max_length=16, unique=True)

    class Meta:
        verbose_name = _('recommendation link')
        verbose_name_plural = _('recommendation links')

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        while not self.slug:
            slug = uuid4().hex[:10]
            if not RecommendationLink.objects.filter(slug=slug).exists():
                self.slug = slug
        return super().save(*args, **kwargs)
