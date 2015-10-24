# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0004_lcregister_mt_730_received_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='FormMCover',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('cover_type', models.SmallIntegerField(verbose_name=b'Cover Type', choices=[(0, b'ITF'), (1, b'STF'), (2, b'UNCONFIRMED')])),
                ('received_at', models.DateField(auto_now_add=True, verbose_name=b'Date Received')),
                ('mf', models.ForeignKey(verbose_name=b'Form M', to='letter_of_credit.FormM')),
            ],
            options={
                'db_table': 'form_m_cover',
            },
        ),
    ]
