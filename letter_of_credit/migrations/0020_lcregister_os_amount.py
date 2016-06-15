# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0019_auto_20160615_0737'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcregister',
            name='os_amount',
            field=models.DecimalField(null=True, verbose_name=b'Amount Outstanding', max_digits=100, decimal_places=2, blank=True),
        ),
    ]
