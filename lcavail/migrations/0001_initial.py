# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LcAvailed',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lc_number', models.CharField(max_length=16, verbose_name=b'LC Number')),
                ('date_negotiated', models.DateField(null=True, verbose_name=b'Date Negotiated', blank=True)),
                ('avail_date', models.DateField(null=True, verbose_name=b'Date Availed', blank=True)),
                ('date_processed', models.DateField(auto_now_add=True, verbose_name=b'Date Processed')),
                ('drawn_amt', models.DecimalField(verbose_name=b'Amount Drawn', max_digits=14, decimal_places=2)),
                ('dr_cr', models.CharField(max_length=1, verbose_name=b'Debit/Credit', choices=[(b'D', b'DR'), (b'C', b'CR')])),
                ('flex_swift', models.CharField(max_length=1, verbose_name=b'Flex/Swift', choices=[(b'S', b'SWIFT'), (b'F', b'FLEX')])),
                ('entry_seq', models.CharField(verbose_name=b'Flexcube ID', max_length=16, null=True, editable=False, blank=True)),
                ('clarec_detail', models.CharField(max_length=1000, null=True, verbose_name=b'Clirec Detail', blank=True)),
                ('memo_acct', models.ForeignKey(db_column=b'memo_acct', verbose_name=b'Memo Cash', to='adhocmodels.LedgerAccount')),
                ('nostro_acct', models.ForeignKey(to='adhocmodels.NostroAccount', db_column=b'nostro_acct')),
            ],
            options={
                'db_table': 'lc_availed',
                'verbose_name': 'LC Availment',
                'verbose_name_plural': 'LC Availment',
            },
        ),
        migrations.CreateModel(
            name='LCCoverMovement',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lc_number', models.CharField(max_length=16, verbose_name=b'LC Number')),
                ('amount', models.DecimalField(verbose_name=b'Amount Moved', max_digits=20, decimal_places=2)),
                ('date_entry_passed', models.DateField(null=True, verbose_name=b'Date Entry Passed', blank=True)),
                ('swift_text', models.TextField(null=True, verbose_name=b'Swift Text', blank=True)),
                ('date_created', models.DateField(auto_now_add=True, verbose_name=b'Date Created')),
                ('acct', models.ForeignKey(verbose_name=b'Nostro Account', to='adhocmodels.NostroAccount')),
                ('memo_acct', models.ForeignKey(verbose_name=b'Memo Cash', to='adhocmodels.LedgerAccount')),
            ],
            options={
                'db_table': 'lc_cv_mvt',
                'verbose_name': 'LC Cover Movement',
                'verbose_name_plural': 'LC Cover Movements',
            },
        ),
    ]
