# Generated by Django 3.1.3 on 2022-08-23 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_auto_20210928_1454'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='density',
            field=models.DecimalField(blank=True, decimal_places=4, max_digits=10, null=True, verbose_name='density'),
        ),
    ]
