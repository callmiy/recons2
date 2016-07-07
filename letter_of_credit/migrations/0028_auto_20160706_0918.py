# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0004_auto_20160322_1818'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('letter_of_credit', '0027_auto_20160703_2347'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConsolidatedLcBidRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateField(auto_now_add=True, verbose_name=b'Date Created')),
                ('requested_at', models.DateField(null=True, verbose_name=b'Date Request To Treasury', blank=True)),
                ('deleted_at', models.DateField(null=True, verbose_name=b'Date Deleted', blank=True)),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=20, decimal_places=2)),
                ('initial_outst_amount', models.DecimalField(default=0, verbose_name=b'Initial Outstanding Amount', max_digits=20, decimal_places=2)),
                ('rate', models.CharField(max_length=200, null=True, verbose_name=b'Rate', blank=True)),
                ('maturity', models.DateField(null=True, verbose_name=b'Maturity Date', blank=True)),
                ('goods_category', models.CharField(max_length=200, null=True, verbose_name=b'Category', blank=True)),
                ('purpose', models.CharField(max_length=300, null=True, verbose_name=b'Purpose', blank=True)),
                ('status', models.CharField(max_length=200, verbose_name=b'Status')),
                ('account_numb', models.CharField(max_length=10, null=True, verbose_name=b'Account Number', blank=True)),
                ('object_id', models.PositiveIntegerField()),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('currency', models.ForeignKey(verbose_name=b'Currency', to='adhocmodels.Currency')),
                ('mf', models.ForeignKey(related_name='consolidated_bids', verbose_name=b'Related Form M', to='letter_of_credit.FormM')),
            ],
            options={
                'db_table': 'consolidated_lc_bid_request',
                'verbose_name': 'Consolidated Lc Bid Request',
                'verbose_name_plural': 'Consolidated Lc Bid Request',
            },
        ),
        migrations.AlterModelOptions(
            name='treasuryallocation',
            options={'verbose_name': 'Treasury Allocation', 'verbose_name_plural': 'Treasury Allocation'},
        ),
    ]
