# Generated by Django 3.1.3 on 2021-09-28 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nutrients', '0005_nutrientrequirement_not_required_by_the_crop'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nutrientrequirement',
            name='not_required_by_the_crop',
            field=models.BooleanField(default=False, help_text='Does not recommend this nutrient for the selected crop', verbose_name='not required by the crop'),
        ),
    ]
