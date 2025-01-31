# Generated by Django 3.1.3 on 2021-07-21 20:53

from django.db import migrations, models
import django.db.models.deletion
import model_utils.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('nutrients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', model_utils.fields.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='name')),
                ('slug', models.CharField(max_length=8, unique=True, verbose_name='slug')),
                ('presentation', models.CharField(choices=[('liquids', 'Liquids'), ('solids', 'Solids')], default='liquids', max_length=32, verbose_name='presentation')),
                ('technology', models.CharField(choices=[('solmix', 'SolMix'), ('microessential', 'Microessential'), ('generic', 'Generic')], default='solmix', max_length=32, verbose_name='technology')),
                ('published', models.BooleanField(default=True, verbose_name='published')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='order')),
            ],
            options={
                'verbose_name': 'product',
                'verbose_name_plural': 'products',
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='ProductNutrient',
            fields=[
                ('id', model_utils.fields.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=4, max_digits=10, verbose_name='amount')),
                ('nutrient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='nutrients.nutrient', verbose_name='nutrient')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nutrients', to='products.product', verbose_name='product')),
            ],
            options={
                'verbose_name': 'product nutrient',
                'verbose_name_plural': 'product nutrients',
                'unique_together': {('nutrient', 'product')},
            },
        ),
    ]
