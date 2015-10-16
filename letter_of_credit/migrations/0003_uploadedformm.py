# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0002_remove_lcregister_ccy'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFormM',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ba', models.CharField(max_length=16, verbose_name=b'BA Number')),
                ('mf', models.CharField(max_length=13, verbose_name=b'Form M Number')),
                ('ccy', models.CharField(max_length=3, verbose_name=b'Currency')),
                ('fob', models.DecimalField(verbose_name=b'FOB Value', max_digits=18, decimal_places=2)),
                ('applicant', models.CharField(max_length=300, verbose_name=b'Applicant')),
                ('submitted_at', models.DateField(verbose_name=b'Date Submitted')),
                ('validated_at', models.DateField(verbose_name=b'Date Validated')),
                ('uploaded_at', models.DateField(auto_now_add=True)),
            ],
            options={
                'db_table': 'uploaded_form_m',
            },
        ),
    ]
