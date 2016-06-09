# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0015_auto_20160310_1652'),
    ]

    operations = [
        migrations.CreateModel(
            name='LcCommission',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('transaction_amount', models.DecimalField(verbose_name=b'Transaction Amount', max_digits=20, decimal_places=2)),
                ('charge_amount', models.DecimalField(verbose_name=b'Charge Amount', max_digits=20, decimal_places=2)),
                ('exchange_rate', models.DecimalField(verbose_name=b'Exchange Rate', max_digits=5, decimal_places=2)),
                ('percent_applied', models.DecimalField(verbose_name=b'Exchange Rate', max_digits=4, decimal_places=2)),
                ('acct_numb', models.CharField(max_length=13, verbose_name=b'Account Number')),
                ('event', models.CharField(max_length=3, verbose_name=b'Event')),
                ('charge_date', models.DateField(verbose_name=b'Charge Date')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name=b'Date Created')),
                ('updated_at', models.DateField(auto_now=True, verbose_name=b'Date Updated')),
                ('deleted_at', models.DateField(null=True, verbose_name=b'Date Deleted', blank=True)),
                ('lc', models.ForeignKey(related_name='lc_commissions', verbose_name=b'LC', blank=True, to='letter_of_credit.LCRegister', null=True)),
            ],
            options={
                'db_table': 'lc_commission',
                'verbose_name': 'Lc Commission',
                'verbose_name_plural': 'Lc Commission',
            },
        ),
    ]
