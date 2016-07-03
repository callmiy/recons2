# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0025_treasuryallocation'),
    ]

    operations = [
        migrations.AddField(
            model_name='treasuryallocation',
            name='customer_name_no_ref',
            field=models.CharField(max_length=300, null=True, verbose_name=b'Customer Name', blank=True),
        ),
        migrations.AddField(
            model_name='treasuryallocation',
            name='original_request',
            field=models.ForeignKey(verbose_name=b'Original Request', blank=True, to='letter_of_credit.LcBidRequest', null=True),
        ),
        migrations.AddField(
            model_name='treasuryallocation',
            name='ref',
            field=models.CharField(max_length=20, null=True, verbose_name=b'REF', blank=True),
        ),
        migrations.AlterField(
            model_name='treasuryallocation',
            name='customer_name',
            field=models.CharField(max_length=300, verbose_name=b'Customer Name With Ref'),
        ),
    ]
