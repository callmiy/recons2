# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('core_recons', '0004_auto_20151213_0041'),
    ]

    operations = [
        migrations.CreateModel(
            name='FxDeal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('amount_allocated', models.DecimalField(verbose_name=b'Amount Allocated', max_digits=12, decimal_places=2)),
                ('amount_utilized', models.DecimalField(null=True, verbose_name=b'Amount Utilized', max_digits=12, decimal_places=2, blank=True)),
                ('allocated_on', models.DateField(verbose_name=b'Date Allocated')),
                ('utilized_on', models.DateField(null=True, verbose_name=b'Date Utilized', blank=True)),
                ('deal_number', models.CharField(max_length=50, verbose_name=b'Deal Number')),
                ('object_id', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name=b'Time created')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name=b'Time updated')),
                ('deleted_at', models.DateTimeField(null=True, verbose_name=b'Time deleted', blank=True)),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('currency', models.ForeignKey(verbose_name=b'Currency', to='adhocmodels.Currency')),
            ],
            options={
                'db_table': 'fx_deal',
                'verbose_name': 'FX Deal',
                'verbose_name_plural': 'FX Deal',
            },
        ),
    ]
