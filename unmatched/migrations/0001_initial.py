# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('adhocmodels', '0001_initial'),
        ('postentry', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TakenToMemo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateField(verbose_name=b'Date Added')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=12, decimal_places=2)),
                ('acct', models.ForeignKey(related_name='taken2memos', verbose_name=b'Account', to='adhocmodels.LedgerAccount')),
            ],
            options={
                'db_table': 'taken2memo',
                'verbose_name': 'Taken To Memo',
                'verbose_name_plural': 'Taken To Memo',
            },
        ),
        migrations.CreateModel(
            name='UnmatchedClarec',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('object_id', models.PositiveIntegerField(null=True, editable=False)),
                ('post_date', models.DateField(verbose_name=b'Post Date')),
                ('valdate', models.DateField(verbose_name=b'Value Date')),
                ('details', models.CharField(max_length=1000, verbose_name=b'Details')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=20, decimal_places=2)),
                ('lc_number', models.CharField(max_length=50, null=True, verbose_name=b'LC Number', blank=True)),
                ('swift_flex', models.CharField(max_length=4, verbose_name=b'Swift or Flex', choices=[(b'S', b'SWIFT'), (b'F', b'FLEXCUBE')])),
                ('dr_cr', models.CharField(max_length=1, verbose_name=b'Dr/Cr', choices=[(b'D', b'DR'), (b'C', b'CR')])),
                ('show', models.BooleanField(default=True)),
                ('date_first_uploaded', models.DateField(auto_now_add=True, verbose_name=b'Date First Uploaded')),
                ('comment', models.TextField(null=True, verbose_name=b'Investigation Comment', blank=True)),
                ('date_upload_processed', models.DateField(null=True, verbose_name=b'Date Upload Processed', blank=True)),
                ('content_type', models.ForeignKey(editable=False, to='contenttypes.ContentType', null=True)),
                ('nostro', models.ForeignKey(verbose_name=b'Nostro', to='adhocmodels.NostroAccount')),
            ],
            options={
                'db_table': 'clirec',
                'verbose_name': 'Clirec',
                'verbose_name_plural': 'Clirec',
            },
        ),
        migrations.CreateModel(
            name='UnmatchedRecons',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('valdate', models.DateField(verbose_name=b'Value Date')),
                ('entry_seq', models.CharField(max_length=16, null=True, verbose_name=b'Entry Sequence No.', blank=True)),
                ('amount', models.DecimalField(verbose_name=b'Dr/Cr', max_digits=16, decimal_places=2)),
                ('lc_number', models.CharField(max_length=50, null=True, verbose_name=b'LC Number', blank=True)),
                ('external_ref', models.CharField(max_length=50, null=True, verbose_name=b'External Reference', blank=True)),
                ('stmt_or_lg', models.CharField(max_length=4, verbose_name=b'Stmt or Ledger', choices=[(b'STMT', b'STATEMENT'), (b'LG', b'LEDGER')])),
                ('date_first_uploaded', models.DateField(auto_now_add=True, verbose_name=b'Date First Uploaded')),
                ('date_upload_processed', models.DateField(null=True, verbose_name=b'Date Upload Processed', blank=True)),
                ('date_finally_processed', models.DateField(null=True, verbose_name=b'Date Finally Processed', blank=True)),
                ('show', models.BooleanField(default=True)),
                ('comment', models.TextField(null=True, verbose_name=b'Investigation Comment', blank=True)),
                ('swift', models.TextField(null=True, verbose_name=b'Swift Message', blank=True)),
                ('clarec_details', models.CharField(max_length=2000, null=True, verbose_name=b'Clarec Details', blank=True)),
                ('acct_numb', models.ForeignKey(db_column=b'acct_numb', verbose_name=b'Nostro', to='adhocmodels.NostroAccount')),
                ('customer', models.ForeignKey(blank=True, to='adhocmodels.Customer', null=True)),
                ('trnx_type', models.ForeignKey(db_column=b'trnx_type', blank=True, to='postentry.EntryGeneratingTransaction', null=True)),
            ],
            options={
                'db_table': 'unmatched_recons',
                'verbose_name': 'Unmatched Recons Record',
                'verbose_name_plural': 'Unmatched Recons Records',
            },
        ),
        migrations.AddField(
            model_name='takentomemo',
            name='clirecs',
            field=models.ManyToManyField(to='unmatched.UnmatchedClarec'),
        ),
        migrations.AddField(
            model_name='takentomemo',
            name='contra_acct',
            field=models.ForeignKey(related_name='taken2memo_contras', verbose_name=b'Contra Account', to='adhocmodels.NostroAccount'),
        ),
        migrations.AlterUniqueTogether(
            name='unmatchedclarec',
            unique_together=set([('post_date', 'valdate', 'details', 'amount', 'nostro', 'swift_flex', 'dr_cr')]),
        ),
    ]
