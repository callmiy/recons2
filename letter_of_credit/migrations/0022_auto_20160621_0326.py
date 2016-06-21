# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0021_uploadedformm_bene'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcbidrequest',
            name='bid_letter',
            field=models.BooleanField(default=False, verbose_name=b'Bid Letter'),
        ),
        migrations.AddField(
            model_name='lcbidrequest',
            name='credit_approval',
            field=models.BooleanField(default=False, verbose_name=b'Credit Approval'),
        ),
        migrations.AddField(
            model_name='lcbidrequest',
            name='rate',
            field=models.CharField(max_length=200, null=True, verbose_name=b'Rate', blank=True),
        ),
    ]
