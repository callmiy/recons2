# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0033_consolidatedlcbidrequest_bid_requests'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='rate',
            field=models.CharField(max_length=200, verbose_name=b'Rate'),
        ),
    ]
