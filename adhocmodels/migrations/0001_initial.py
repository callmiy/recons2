# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AccountNumber',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('nuban', models.CharField(unique=True, max_length=10, verbose_name=b'Nuban')),
                ('old_numb', models.CharField(max_length=13, null=True, verbose_name=b'Old Acct. Number', blank=True)),
                ('acct_id', models.CharField(unique=True, max_length=10, verbose_name=b'Customer ID For Acct.')),
            ],
            options={
                'ordering': ('owner', 'nuban'),
                'db_table': 'acct_numb',
            },
        ),
        migrations.CreateModel(
            name='Branch',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=3, verbose_name=b'Branch Code')),
                ('name', models.CharField(max_length=50, verbose_name=b'Branch Name')),
            ],
            options={
                'ordering': ('name', 'code'),
                'db_table': 'branch',
                'verbose_name_plural': 'Branches',
            },
        ),
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=3, verbose_name=b'Currency Code')),
                ('name', models.CharField(max_length=50, verbose_name=b'Currency Name')),
            ],
            options={
                'db_table': 'currency',
                'verbose_name_plural': 'Currencies',
            },
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200, verbose_name=b'Name')),
                ('branch_for_itf', models.ForeignKey(db_column=b'brn_itf', blank=True, to='adhocmodels.Branch', null=True)),
                ('parent', models.ForeignKey(related_name='subsidiaries', db_column=b'parent', blank=True, to='adhocmodels.Customer', null=True)),
            ],
            options={
                'ordering': ('name',),
                'db_table': 'customer',
            },
        ),
        migrations.CreateModel(
            name='LedgerAccount',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.CharField(unique=True, max_length=60, verbose_name=b'Account Number')),
                ('is_default_memo', models.BooleanField(default=False, verbose_name=b'Default For Memo Cash Account?')),
                ('name', models.CharField(max_length=255, null=True, verbose_name=b'Account Name', blank=True)),
            ],
            options={
                'db_table': 'ledger_acct',
                'verbose_name': 'Ledger Account',
                'verbose_name_plural': 'Ledger Accounts',
            },
        ),
        migrations.CreateModel(
            name='LedgerAccountType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=4, verbose_name=b'Account Code')),
                ('description', models.CharField(max_length=100, verbose_name=b'Accout Type Description')),
            ],
            options={
                'ordering': ('code',),
                'db_table': 'ledger_acct_type',
                'verbose_name': 'Ledger Account Type',
                'verbose_name_plural': 'Ledger Account Types',
            },
        ),
        migrations.CreateModel(
            name='NostroAccount',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.CharField(unique=True, max_length=60, verbose_name=b'Account Number')),
                ('name', models.CharField(max_length=1000, null=True, verbose_name=b'Account Name', blank=True)),
            ],
            options={
                'db_table': 'nostro_acct',
            },
        ),
        migrations.CreateModel(
            name='OverseasBank',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, verbose_name=b'Bank Name')),
                ('swift_bic', models.CharField(unique=True, max_length=11, verbose_name=b'Swift Bic')),
            ],
            options={
                'ordering': ('swift_bic', 'name'),
                'db_table': 'overseas_bank',
                'verbose_name_plural': 'Overseas Banks',
            },
        ),
        migrations.CreateModel(
            name='RelationshipManager',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50, verbose_name=b'Name')),
                ('rmcode', models.CharField(unique=True, max_length=15, verbose_name=b'RM Code')),
                ('branch', models.ForeignKey(related_name='rel_managers', to='adhocmodels.Branch')),
            ],
            options={
                'ordering': ('name', 'rmcode'),
                'db_table': 'rel_manager',
                'verbose_name': 'Relationship Manager',
                'verbose_name_plural': 'Relationship Managers',
            },
        ),
        migrations.CreateModel(
            name='ValidTransactionRef',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('valid_ref_start', models.CharField(max_length=16, verbose_name=b'First four digits of reference')),
            ],
            options={
                'db_table': 'valid_refs',
                'verbose_name': 'Valid Transaction Reference',
                'verbose_name_plural': 'Valid Transaction References',
            },
        ),
        migrations.AddField(
            model_name='nostroaccount',
            name='bank',
            field=models.ForeignKey(related_name='my_nostros', db_column=b'bank', verbose_name=b'Overseas Bank Name', to='adhocmodels.OverseasBank'),
        ),
        migrations.AddField(
            model_name='nostroaccount',
            name='ccy',
            field=models.ForeignKey(related_name='ccy_nostros', db_column=b'ccy', verbose_name=b'Currency', to='adhocmodels.Currency'),
        ),
        migrations.AddField(
            model_name='ledgeraccount',
            name='acct_type',
            field=models.ForeignKey(related_name='ledger_acct_types', db_column=b'acct_type', verbose_name=b'Account Type', to='adhocmodels.LedgerAccountType'),
        ),
        migrations.AddField(
            model_name='ledgeraccount',
            name='ccy',
            field=models.ForeignKey(to='adhocmodels.Currency', db_column=b'ccy'),
        ),
        migrations.AddField(
            model_name='ledgeraccount',
            name='external_number',
            field=models.ForeignKey(related_name='ledger_acct', db_column=b'external_number', blank=True, to='adhocmodels.NostroAccount', null=True, verbose_name=b'External Acct. Number'),
        ),
        migrations.AddField(
            model_name='customer',
            name='rel_manager',
            field=models.ForeignKey(related_name='clients', db_column=b'rel_manager', blank=True, to='adhocmodels.RelationshipManager', null=True),
        ),
        migrations.AddField(
            model_name='accountnumber',
            name='branch',
            field=models.ForeignKey(related_name='accts', to='adhocmodels.Branch'),
        ),
        migrations.AddField(
            model_name='accountnumber',
            name='owner',
            field=models.ForeignKey(related_name='acct_numbs', verbose_name=b'Customer Name', to='adhocmodels.Customer'),
        ),
        migrations.AlterUniqueTogether(
            name='nostroaccount',
            unique_together=set([('bank', 'ccy', 'number')]),
        ),
    ]
