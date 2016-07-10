# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0043_remove_consolidatedlcbidrequest_bid_requests'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consolidatedlcbidrequest',
            name='amount',
            field=models.DecimalField(default=0, verbose_name=b'Amount', max_digits=20, decimal_places=2),
        ),
    ]
