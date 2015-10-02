# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=14, decimal_places=2)),
                ('time_created', models.DateTimeField(auto_now_add=True, verbose_name=b'Time Created')),
                ('time_processed_for_posting', models.DateTimeField(null=True, verbose_name=b'Time Processed For Posting', blank=True)),
            ],
            options={
                'db_table': 'entry',
                'verbose_name_plural': 'Entries',
            },
        ),
        migrations.CreateModel(
            name='EntryCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=3, verbose_name=b'Entry Code')),
                ('description', models.CharField(max_length=80, verbose_name=b'Entry Code Description')),
            ],
            options={
                'ordering': ('code',),
                'db_table': 'entry_code',
                'verbose_name': 'Entry Code',
                'verbose_name_plural': 'Entry Codes',
            },
        ),
        migrations.CreateModel(
            name='EntryContra',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('object_id', models.PositiveIntegerField(verbose_name=b'Object ID', null=True, editable=False)),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=14, decimal_places=2)),
                ('narration', models.CharField(max_length=100, verbose_name=b'Narration')),
                ('ref', models.CharField(verbose_name=b'Reference', max_length=16, null=True, editable=False, blank=True)),
                ('rm_code', models.CharField(max_length=12, null=True, verbose_name=b'RM CODE', blank=True)),
                ('branch_for_itf_int', models.CharField(max_length=3, null=True, verbose_name=b'BRANCH FOR ITF INT', blank=True)),
                ('flex_id', models.CharField(max_length=20, null=True, verbose_name=b'Flex ID', blank=True)),
                ('date_posted', models.DateField(null=True, verbose_name=b'Date Posted', blank=True)),
                ('unmatched', models.IntegerField(verbose_name=b'Unmatched ID', null=True, editable=False, blank=True)),
                ('account', models.ForeignKey(to='adhocmodels.LedgerAccount', db_column=b'account')),
                ('code', models.ForeignKey(to='postentry.EntryCode', db_column=b'code')),
                ('content_type', models.ForeignKey(editable=False, to='contenttypes.ContentType', null=True)),
                ('entry', models.ForeignKey(related_name='contras', db_column=b'entry', to='postentry.Entry')),
            ],
            options={
                'db_table': 'entry_contra',
                'verbose_name': 'Entry Contra',
                'verbose_name_plural': 'Entry Contras',
            },
        ),
        migrations.CreateModel(
            name='EntryGeneratingTransaction',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('short_name', models.CharField(unique=True, max_length=20, verbose_name=b'Short Descriptive Name')),
                ('description', models.CharField(max_length=100)),
                ('display', models.BooleanField(default=False)),
            ],
            options={
                'db_table': 'entry_gen_trxn',
                'verbose_name': 'Entry Generating Transaction',
                'verbose_name_plural': 'Entry Generating Transactions',
            },
        ),
        migrations.AddField(
            model_name='entrycontra',
            name='entry_gen_trxn',
            field=models.ForeignKey(db_column=b'entry_gen_trxn', to='postentry.EntryGeneratingTransaction', null=True),
        ),
    ]
