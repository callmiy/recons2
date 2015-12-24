# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('contingent_report', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OldContingentReport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('flex_ref', models.CharField(max_length=50, verbose_name=b'Flexcube Ref')),
                ('lc_ref', models.CharField(max_length=16, null=True, verbose_name=b'LC Ref', blank=True)),
                ('flex_module', models.CharField(max_length=2, verbose_name=b'Flexcube Module')),
                ('gl_code', models.CharField(max_length=50, verbose_name=b'GL Acct. Number')),
                ('customer_name', models.CharField(max_length=200, null=True, verbose_name=b'Customer Name', blank=True)),
                ('customer_id', models.CharField(max_length=20, null=True, verbose_name=b'Customer ID', blank=True)),
                ('booking_date', models.DateField(verbose_name=b'Booking Date')),
                ('liq_date', models.DateField(verbose_name=b'Liquidation Date')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('fx_amt', models.DecimalField(verbose_name=b'FX Amount', max_digits=100, decimal_places=2)),
                ('ngn_amt', models.DecimalField(verbose_name=b'NGN Amount', max_digits=100, decimal_places=2)),
                ('ispar', models.BooleanField(default=False, verbose_name=b'Is Parent')),
                ('narration', models.CharField(max_length=300, null=True, verbose_name=b'Narration', blank=True)),
                ('parent', models.ForeignKey(related_name='members', db_column=b'parent', blank=True, to='contingent_report.OldContingentReport', null=True)),
            ],
            options={
                'ordering': ('-booking_date',),
                'db_table': 'old_contingent_report',
                'verbose_name': 'Old Contingent Report',
                'verbose_name_plural': 'Old Contingent Reports',
            },
        ),
    ]
