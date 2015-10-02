# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Charge',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=9, decimal_places=2)),
                ('overseas_ref', models.CharField(max_length=16, null=True, verbose_name=b'Overseas Reference', blank=True)),
                ('date_processed', models.DateField(auto_now_add=True, verbose_name=b'Processing Date')),
                ('val_date_dr', models.DateField(null=True, verbose_name=b'Val Date of Dr', blank=True)),
                ('val_date_adv', models.DateField(null=True, verbose_name=b'Date Advd', blank=True)),
                ('tkt_req_date', models.DateField(null=True, verbose_name=b'Ticket Req. Date', blank=True)),
                ('tkt_mvd_date', models.DateField(null=True, verbose_name=b'Ticket Moved Date', blank=True)),
                ('swift_txt', models.TextField(null=True, verbose_name=b'Swift Message', blank=True)),
                ('lc_number', models.CharField(max_length=16, verbose_name=b'LC Number')),
                ('entry_seq', models.CharField(verbose_name=b'Flex ID', max_length=16, null=True, editable=False, blank=True)),
                ('clarec_details', models.CharField(max_length=1000, null=True, verbose_name=b'Clarec Details', blank=True)),
                ('clirec_details', models.CharField(max_length=1000, null=True, verbose_name=b'Clirec Details', blank=True)),
                ('ccy', models.ForeignKey(db_column=b'ccy', verbose_name=b'Currency', to='adhocmodels.Currency')),
                ('cr_acct', models.ForeignKey(db_column=b'cr_acct', blank=True, to='adhocmodels.NostroAccount', null=True, verbose_name=b'Acct. to credit')),
                ('customer', models.ForeignKey(db_column=b'customer', verbose_name=b'Customer Name', to='adhocmodels.Customer')),
                ('req_bank', models.ForeignKey(db_column=b'req_bank', verbose_name=b'Requesting Bank', to='adhocmodels.OverseasBank')),
            ],
            options={
                'ordering': ('val_date_dr', '-id'),
                'db_table': 'chg',
            },
        ),
    ]
