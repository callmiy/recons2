# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ContingentAccount',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('gl_code', models.CharField(unique=True, max_length=50, verbose_name=b'GL Acct. Number')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('in_use', models.NullBooleanField(default=None, verbose_name=b'In Use')),
                ('acct_class', models.CharField(default=b'', max_length=10, verbose_name=b'Account Class')),
            ],
            options={
                'ordering': ('ccy',),
                'db_table': 'contingent_acct',
                'verbose_name': 'Contingent Account',
                'verbose_name_plural': 'Contingent Accounts',
            },
        ),
        migrations.CreateModel(
            name='ContingentReport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('flex_ref', models.CharField(max_length=50, verbose_name=b'Flexcube Ref')),
                ('ti_ref', models.CharField(max_length=16, null=True, verbose_name=b'TI Ref', blank=True)),
                ('flex_module', models.CharField(max_length=2, verbose_name=b'Flexcube Module')),
                ('gl_code', models.CharField(max_length=50, verbose_name=b'GL Acct. Number')),
                ('customer_name', models.CharField(max_length=200, null=True, verbose_name=b'Customer Name', blank=True)),
                ('booking_date', models.DateField(verbose_name=b'Booking Date')),
                ('liq_date', models.DateField(verbose_name=b'Liquidation Date')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('fx_amt', models.DecimalField(verbose_name=b'FX Amount', max_digits=100, decimal_places=2)),
                ('ngn_amt', models.DecimalField(verbose_name=b'NGN Amount', max_digits=100, decimal_places=2)),
                ('ispar', models.BooleanField(default=False, verbose_name=b'Is Parent')),
                ('narration', models.CharField(max_length=300, null=True, verbose_name=b'Narration', blank=True)),
                ('acct_numb', models.ForeignKey(related_name='entries', blank=True, to='contingent_report.ContingentAccount', null=True)),
                ('parent', models.ForeignKey(related_name='members', db_column=b'parent', blank=True, to='contingent_report.ContingentReport', null=True)),
            ],
            options={
                'ordering': ('-booking_date',),
                'db_table': 'contingent_report',
                'verbose_name': 'Contingent Report',
                'verbose_name_plural': 'Contingent Reports',
            },
        ),
        migrations.CreateModel(
            name='LCClass',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('prod_code', models.CharField(unique=True, max_length=4, verbose_name=b'Product Code')),
                ('desc', models.CharField(max_length=100, verbose_name=b'Description')),
            ],
            options={
                'db_table': 'lc_class',
                'verbose_name': 'LC Class',
                'verbose_name_plural': 'LC Classes',
            },
        ),
        migrations.CreateModel(
            name='TIFlexRecons',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('brn_code', models.CharField(max_length=3, verbose_name=b'Branch Code')),
                ('brn_name', models.CharField(max_length=200, verbose_name=b'Branch Name')),
                ('flex_ref', models.CharField(max_length=16, verbose_name=b'Flex Ref')),
                ('ti_ref', models.CharField(max_length=20, verbose_name=b'TI Ref')),
                ('acct_numb', models.CharField(max_length=20, verbose_name=b'Account Number')),
                ('acct_name', models.CharField(max_length=200, verbose_name=b'Account Name')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('dr_cr', models.CharField(max_length=1, verbose_name=b'Dr/Cr')),
                ('fcy_amt', models.DecimalField(verbose_name=b'Fcy Amount', max_digits=20, decimal_places=2)),
                ('lcy_amt', models.DecimalField(verbose_name=b'Lcy Amount', max_digits=20, decimal_places=2)),
                ('val_date', models.DateField(verbose_name=b'Value Date')),
                ('narration', models.CharField(max_length=200, verbose_name=b'Narration')),
            ],
            options={
                'ordering': ('-val_date',),
                'db_table': 'ti_flex',
                'verbose_name': 'TI Flex Recons Date Prompt',
                'verbose_name_plural': 'TI Flex Recons Date Prompt',
            },
        ),
        migrations.CreateModel(
            name='TIPostingStatusReport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ref', models.CharField(max_length=20, verbose_name=b'TI Ref Number')),
                ('posting_date', models.DateField(verbose_name=b'Posting Date')),
                ('acct_number', models.CharField(max_length=100, verbose_name=b'Account Number')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=100, decimal_places=2)),
                ('narration', models.CharField(max_length=200, verbose_name=b'Narration')),
                ('applicant', models.CharField(max_length=200, null=True, verbose_name=b'Applicant', blank=True)),
                ('success', models.CharField(max_length=7, verbose_name=b'Success or Failure')),
                ('mf', models.CharField(max_length=13, null=True, verbose_name=b'Form M Number', blank=True)),
                ('ba', models.CharField(max_length=16, null=True, verbose_name=b'BA Number', blank=True)),
                ('comment', models.TextField(null=True, verbose_name=b'Comment', blank=True)),
            ],
            options={
                'ordering': ('-posting_date',),
                'db_table': 'ti_posting_status_report',
            },
        ),
    ]
