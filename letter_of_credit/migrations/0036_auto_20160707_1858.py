# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0035_auto_20160707_1435'),
    ]

    operations = [
        migrations.AddField(
            model_name='consolidatedlcbidrequest',
            name='allocations',
            field=models.TextField(null=True, verbose_name=b'Allocation mapping from ID to amount for this bid', blank=True),
        ),
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='bid_requests',
            field=models.TextField(verbose_name=b'Related Bid requests mapping from ID to amount'),
        ),
    ]
