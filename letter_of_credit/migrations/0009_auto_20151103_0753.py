# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0008_auto_20151029_0017'),
    ]

    operations = [
        migrations.AddField(
            model_name='uploadedformm',
            name='cost_freight',
            field=models.DecimalField(null=True, verbose_name=b'Cost and freight', max_digits=18, decimal_places=2, blank=True),
        ),
        migrations.AddField(
            model_name='uploadedformm',
            name='goods_description',
            field=models.CharField(max_length=1000, null=True, verbose_name=b'Goods Description', blank=True),
        ),
        migrations.AddField(
            model_name='uploadedformm',
            name='status',
            field=models.CharField(max_length=20, null=True, verbose_name=b'Status', blank=True),
        ),
        migrations.AddField(
            model_name='uploadedformm',
            name='validity_type',
            field=models.CharField(max_length=100, null=True, verbose_name=b'Validity Type', blank=True),
        ),
        migrations.AlterField(
            model_name='uploadedformm',
            name='validated_at',
            field=models.DateField(null=True, verbose_name=b'Date Validated', blank=True),
        ),
    ]
