# Generated by Django 3.1.3 on 2022-03-04 09:30

from django.db import migrations, models
import model_utils.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RecommendationLink',
            fields=[
                ('id', model_utils.fields.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('url', models.TextField(verbose_name='url')),
                ('slug', models.CharField(max_length=16, unique=True, verbose_name='slug')),
            ],
            options={
                'verbose_name': 'recommendation link',
                'verbose_name_plural': 'recommendation links',
            },
        ),
    ]
