# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0018_auto_20160611_1653'),
    ]

    operations = [
        migrations.AddField(
            model_name='lcregister',
            name='status',
            field=models.CharField(default=b'LIV', max_length=3, verbose_name=b'Status'),
        ),
        migrations.AlterField(
            model_name='lccommission',
            name='acct_numb',
            field=models.CharField(max_length=13, verbose_name=b'Account'),
        ),
        migrations.AlterField(
            model_name='lccommission',
            name='exchange_rate',
            field=models.DecimalField(verbose_name=b'X rate', max_digits=5, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='lccommission',
            name='percent_applied',
            field=models.DecimalField(verbose_name=b'% Applied', max_digits=4, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='lccommission',
            name='transaction_amount',
            field=models.DecimalField(verbose_name=b'Trxn Amount', max_digits=20, decimal_places=2),
        ),
    ]
