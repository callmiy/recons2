# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0030_remove_consolidatedlcbidrequest_currency'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consolidatedlcbidrequest',
            name='initial_outst_amount',
        ),
        migrations.AddField(
            model_name='consolidatedlcbidrequest',
            name='initial_allocated_amount',
            field=models.DecimalField(default=0, verbose_name=b'Initial Allocated Amount', max_digits=20, decimal_places=2),
        ),
    ]
