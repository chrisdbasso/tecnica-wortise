# Generated by Django 3.1.3 on 2021-08-23 18:54

from django.db import migrations, models
import django.db.models.deletion
import model_utils.fields
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('nutrients', '0002_auto_20210810_1400'),
    ]

    operations = [
        migrations.CreateModel(
            name='NutrientConvertionParameter',
            fields=[
                ('id', model_utils.fields.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='name')),
                ('nutrient_from', models.CharField(max_length=64, unique=True, verbose_name='from')),
                ('nutrient_to', models.CharField(max_length=64, unique=True, verbose_name='to')),
                ('factor', models.DecimalField(decimal_places=2, max_digits=4, verbose_name='factor')),
                ('nutrient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nutrients.nutrient', verbose_name='nutrient')),
            ],
            options={
                'verbose_name': 'nutrient convertion parameter',
                'verbose_name_plural': 'nutrient convertion parameters',
            },
        ),
    ]
