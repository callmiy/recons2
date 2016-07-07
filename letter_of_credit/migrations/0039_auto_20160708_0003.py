# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0038_auto_20160707_2333'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='treasuryallocation',
            name='original_request',
        ),
        migrations.AddField(
            model_name='treasuryallocation',
            name='consolidated_bids',
            field=models.ManyToManyField(related_name='consolidated_bid_requests', verbose_name=b'Related Consolidated Bids', to='letter_of_credit.ConsolidatedLcBidRequest'),
        ),
    ]
