# Generated by Django 3.1.3 on 2022-09-02 19:07

from django.db import migrations, models
import model_utils.fields
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('nutrients', '0007_nutrient_published'),
    ]

    operations = [
        migrations.CreateModel(
            name='SoilType',
            fields=[
                ('id', model_utils.fields.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='name')),
                ('multiplier', models.DecimalField(decimal_places=5, max_digits=8, verbose_name='multiplier')),
            ],
            options={
                'verbose_name': 'soil type',
                'verbose_name_plural': 'soil types',
            },
        ),
    ]
