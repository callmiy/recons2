# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0013_auto_20160123_1002'),
    ]

    operations = [
        migrations.CreateModel(
            name='FormMStatus',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('code', models.CharField(unique=True, max_length=20, verbose_name=b'Code')),
                ('description', models.CharField(max_length=100, verbose_name=b'Description')),
            ],
            options={
                'db_table': 'form_m_status',
                'verbose_name': 'Form M Status',
                'verbose_name_plural': 'Form M Status',
            },
        ),
        migrations.AddField(
            model_name='lcbidrequest',
            name='deleted_at',
            field=models.DateField(null=True, verbose_name=b'Date Deleted', blank=True),
        ),
    ]
