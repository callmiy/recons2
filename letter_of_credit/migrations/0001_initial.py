# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FormM',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.CharField(unique=True, max_length=13, verbose_name=b'Number')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=20, decimal_places=2)),
                ('date_received', models.DateField(verbose_name=b'Date Received')),
                ('goods_description', models.CharField(max_length=1000, null=True, verbose_name=b'Goods Description', blank=True)),
                ('applicant', models.ForeignKey(verbose_name=b'Applicant', to='adhocmodels.Customer')),
                ('currency', models.ForeignKey(verbose_name=b'Currency', to='adhocmodels.Currency')),
            ],
            options={
                'ordering': ('-date_received',),
                'db_table': 'form_m',
                'verbose_name': 'Form M',
                'verbose_name_plural': 'Form M',
            },
        ),
        migrations.CreateModel(
            name='LcBidRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateField(auto_now_add=True, verbose_name=b'Date Created')),
                ('requested_at', models.DateField(null=True, verbose_name=b'Date Request To Treasury', blank=True)),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=20, decimal_places=2)),
                ('downloaded', models.BooleanField(default=False, verbose_name=b'Downloaded')),
                ('mf', models.ForeignKey(related_name='bids', verbose_name=b'Related Form M', to='letter_of_credit.FormM')),
            ],
            options={
                'db_table': 'lc_bid_request',
                'verbose_name': 'Lc Bid Request',
                'verbose_name_plural': 'Lc Bid Request',
            },
        ),
        migrations.CreateModel(
            name='LCIssue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(max_length=300, verbose_name=b'Issue Text')),
            ],
            options={
                'db_table': 'lc_issue',
                'verbose_name': 'LC Issue',
                'verbose_name_plural': 'LC Issue',
            },
        ),
        migrations.CreateModel(
            name='LCIssueConcrete',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateField(auto_now_add=True, verbose_name=b'Date Created')),
                ('closed_at', models.DateField(null=True, verbose_name=b'Date Closed', blank=True)),
                ('issue', models.ForeignKey(verbose_name=b'Issue', to='letter_of_credit.LCIssue')),
                ('mf', models.ForeignKey(related_name='form_m_issues', verbose_name=b'Related Form M', to='letter_of_credit.FormM')),
            ],
            options={
                'db_table': 'lc_issue_concrete',
                'verbose_name': 'LC Issue Concrete',
                'verbose_name_plural': 'LC Issue Concrete',
            },
        ),
        migrations.CreateModel(
            name='LCRegister',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lc_number', models.CharField(max_length=20, verbose_name=b'LC Number')),
                ('mf', models.CharField(max_length=20, null=True, verbose_name=b'Form M Number', blank=True)),
                ('date_started', models.DateField(auto_now_add=True, verbose_name=b'Date Started')),
                ('estb_date', models.DateField(verbose_name=b'Estab. Date')),
                ('expiry_date', models.DateField(verbose_name=b'Expiry Date')),
                ('confirmation', models.CharField(max_length=100, null=True, verbose_name=b'Confirmation', blank=True)),
                ('lc_class', models.CharField(max_length=100, null=True, verbose_name=b'LC Classification', blank=True)),
                ('applicant', models.CharField(max_length=200, verbose_name=b'Applicant')),
                ('address', models.CharField(max_length=200, null=True, verbose_name=b'Applicant Address', blank=True)),
                ('bene', models.CharField(max_length=200, null=True, verbose_name=b'Beneficiary Name', blank=True)),
                ('bene_country', models.CharField(max_length=200, null=True, verbose_name=b'Beneficiary Address', blank=True)),
                ('advising_bank', models.CharField(max_length=200, null=True, verbose_name=b'Advising Bank', blank=True)),
                ('ccy', models.CharField(max_length=3, null=True, editable=False, blank=True)),
                ('lc_amt_org_ccy', models.DecimalField(verbose_name=b'FX Amount', max_digits=100, decimal_places=2)),
                ('lc_amt_usd', models.DecimalField(null=True, verbose_name=b'LC Amount In USD', max_digits=100, decimal_places=2, blank=True)),
                ('supply_country', models.CharField(max_length=200, null=True, verbose_name=b'Country of Supply', blank=True)),
                ('port', models.CharField(max_length=200, null=True, verbose_name=b'Port of Discharge', blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'Goods Description', blank=True)),
                ('ba', models.CharField(max_length=20, null=True, verbose_name=b'BA Number', blank=True)),
                ('acct_numb', models.CharField(max_length=13, null=True, verbose_name=b'Account Number', blank=True)),
                ('brn_code', models.CharField(max_length=3, null=True, verbose_name=b'Branch Code', blank=True)),
                ('brn_name', models.CharField(max_length=200, null=True, verbose_name=b'Branch Name', blank=True)),
                ('sector', models.CharField(blank=True, max_length=11, null=True, verbose_name=b'Sector', choices=[(b'CBG', b'CBG'), (b'COMMERCIAL', b'COMMERCIAL')])),
                ('applicant_obj', models.ForeignKey(related_name='lc_register_obj', blank=True, to='adhocmodels.Customer', null=True)),
                ('brn_obj', models.ForeignKey(blank=True, to='adhocmodels.Branch', null=True)),
                ('ccy_obj', models.ForeignKey(related_name='lc_reg_ccy', verbose_name=b'Currency', to='adhocmodels.Currency')),
            ],
            options={
                'ordering': ('-estb_date',),
                'db_table': 'lc_register',
            },
        ),
        migrations.CreateModel(
            name='LcStatus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.CharField(max_length=256, verbose_name=b'Status text')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Creation Time')),
            ],
            options={
                'db_table': 'lc_status',
            },
        ),
        migrations.CreateModel(
            name='LetterOfCredit',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('lc_ref', models.CharField(max_length=16, null=True, verbose_name=b'LC Reference')),
                ('mf', models.CharField(max_length=13, null=True, verbose_name=b'Form M Number')),
                ('ti_mf', models.CharField(max_length=12, null=True, verbose_name=b'TI Number for Form M')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=14, decimal_places=2)),
                ('bid_date', models.DateField(null=True, verbose_name=b'Bid Date')),
                ('date_started', models.DateField(auto_now_add=True, verbose_name=b'Date Started')),
                ('date_released', models.DateField(null=True, verbose_name=b'Date Released')),
                ('applicant', models.ForeignKey(to='adhocmodels.Customer')),
                ('ccy', models.ForeignKey(verbose_name=b'Currency', to='adhocmodels.Currency')),
            ],
            options={
                'db_table': 'letter_of_credit',
            },
        ),
        migrations.AddField(
            model_name='lcstatus',
            name='lc',
            field=models.ForeignKey(related_name='statuses', verbose_name=b'Owner LC', to='letter_of_credit.LetterOfCredit'),
        ),
        migrations.AddField(
            model_name='formm',
            name='lc',
            field=models.ForeignKey(related_name='form_m', verbose_name=b'LC', blank=True, to='letter_of_credit.LCRegister', null=True),
        ),
    ]
