# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0036_auto_20160707_1858'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='bid_requests',
        ),
        migrations.AddField(
            model_name='consolidatedlcbidrequest',
            name='bid_requests',
            field=models.ManyToManyField(related_name='consolidated_bids', verbose_name=b'Related Bid Requests', to='letter_of_credit.LcBidRequest'),
        ),
    ]
