# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0024_lcbidrequest_docs_complete'),
    ]

    operations = [
        migrations.CreateModel(
            name='TreasuryAllocation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time created')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name=b'Time updated')),
                ('deleted_at', models.DateTimeField(null=True, verbose_name=b'Time deleted', blank=True)),
                ('deal_number', models.CharField(max_length=50, verbose_name=b'Deal Number')),
                ('transaction_type', models.CharField(max_length=50, verbose_name=b'Transaction Type')),
                ('product_type', models.CharField(max_length=50, null=True, verbose_name=b'Product Type', blank=True)),
                ('customer_name', models.CharField(max_length=300, verbose_name=b'Customer Name')),
                ('client_category', models.CharField(max_length=200, verbose_name=b'Client Category')),
                ('source_of_fund', models.CharField(max_length=20, null=True, verbose_name=b'Source of fund', blank=True)),
                ('currency', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('fcy_amount', models.DecimalField(verbose_name=b'FCY Amount', max_digits=12, decimal_places=2)),
                ('naira_rate', models.DecimalField(verbose_name=b'Naira rate', max_digits=9, decimal_places=4)),
                ('deal_date', models.DateField(verbose_name=b'Deal Date')),
                ('settlement_date', models.DateField(verbose_name=b'Settlement Date')),
            ],
            options={
                'db_table': 'treasury_allocation',
                'verbose_name': 'Treasury Allocation',
                'verbose_name_plural': 'Treasury Allocation',
            },
        ),
    ]
