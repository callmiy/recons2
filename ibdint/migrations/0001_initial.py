# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='IbdInt',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('valdate_in_ca', models.DateField(verbose_name=b'Value date In C/A')),
                ('date_processed', models.DateField(auto_now_add=True, verbose_name=b'Date Processed')),
                ('lc_number', models.CharField(max_length=16, verbose_name=b'LC Number')),
                ('overseas_ref', models.CharField(max_length=16, null=True, verbose_name=b'Overseas Bank Ref', blank=True)),
                ('amount', models.DecimalField(verbose_name=b'Interest Amount', max_digits=9, decimal_places=2)),
                ('valdate_in_pl', models.DateField(null=True, verbose_name=b'Date Paid into P and L', blank=True)),
                ('clarec_details', models.CharField(max_length=1000, null=True, blank=True)),
                ('entry_seq', models.CharField(verbose_name=b'Flexcube ID', max_length=16, null=True, editable=False, blank=True)),
                ('acct', models.ForeignKey(db_column=b'acct', verbose_name=b'Account', to='adhocmodels.NostroAccount')),
                ('customer', models.ForeignKey(db_column=b'customer', blank=True, to='adhocmodels.Customer', null=True)),
            ],
            options={
                'ordering': ('date_processed', 'valdate_in_ca'),
                'db_table': 'ibd_int',
                'verbose_name': 'IBD Interest',
                'verbose_name_plural': 'IBD Interests',
            },
        ),
    ]
