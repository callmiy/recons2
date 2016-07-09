# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0039_auto_20160708_0003'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='allocations',
        ),
        migrations.AddField(
            model_name='treasuryallocation',
            name='distribution_to_consolidated_bids',
            field=models.TextField(default=b'{}', verbose_name=b'Mapping from ID to amount distributed to a consolidated bid object'),
        ),
        migrations.AlterField(
            model_name='treasuryallocation',
            name='consolidated_bids',
            field=models.ManyToManyField(related_name='treasury_allocations', verbose_name=b'Related Consolidated Bids', to='letter_of_credit.ConsolidatedLcBidRequest'),
        ),
    ]
