# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SourceFx',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=100, verbose_name=b'Code')),
                ('description', models.CharField(max_length=255, null=True, verbose_name=b'Description', blank=True)),
            ],
            options={
                'db_table': 'source_fx',
                'verbose_name': 'Source of FX',
                'verbose_name_plural': 'Sorce of FX',
            },
        ),
        migrations.CreateModel(
            name='UndrawnBal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lc_number', models.CharField(max_length=16, verbose_name=b'LC Number')),
                ('estb_amt', models.DecimalField(verbose_name=b'Estab. Amount', max_digits=20, decimal_places=2)),
                ('claim_amt', models.DecimalField(verbose_name=b'Claim Amount', max_digits=20, decimal_places=2)),
                ('surplus_amt', models.DecimalField(verbose_name=b'Surplus Amount', max_digits=20, decimal_places=2)),
                ('formm_numb', models.CharField(max_length=21, null=True, verbose_name=b'Form M Number', blank=True)),
                ('rate', models.DecimalField(null=True, verbose_name=b'Rate', max_digits=14, decimal_places=7, blank=True)),
                ('ticket_no', models.IntegerField(null=True, verbose_name=b'Ticket No.', blank=True)),
                ('date_cust_paid', models.DateField(null=True, verbose_name=b'Day Cust. Paid', blank=True)),
                ('claim_amt_ccy', models.ForeignKey(related_name='claim_amt_ccy', verbose_name=b'Claim Amount Currency', to='adhocmodels.Currency')),
                ('customer', models.ForeignKey(related_name='cust_undrawn_bals', to='adhocmodels.Customer')),
                ('estb_amt_ccy', models.ForeignKey(related_name='estb_amt_ccy', verbose_name=b'Estb. Amount Currency', to='adhocmodels.Currency')),
                ('nostro', models.ForeignKey(related_name='undrawn_nostros', to='adhocmodels.NostroAccount')),
                ('source_fund', models.ForeignKey(to='undrawnbal.SourceFx')),
                ('surplus_amt_ccy', models.ForeignKey(related_name='surplus_amt_ccy', verbose_name=b'Surplus Amount Currency', to='adhocmodels.Currency')),
            ],
            options={
                'db_table': 'undrawn',
                'verbose_name': 'Undrawn Balance',
                'verbose_name_plural': 'Undrawn Balances',
            },
        ),
    ]
