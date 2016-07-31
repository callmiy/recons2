# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0046_auto_20160710_1110'),
    ]

    operations = [
        migrations.AlterField(
            model_name='treasuryallocation',
            name='consolidated_bids',
            field=models.ManyToManyField(related_name='treasury_allocations', verbose_name=b'Related Consolidated Bids', to='letter_of_credit.ConsolidatedLcBidRequest', blank=True),
        ),
    ]
