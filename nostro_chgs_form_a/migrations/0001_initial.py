# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import nostro_chgs_form_a.models


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='NostroChgsFormA',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('completion_date', models.DateField(auto_now_add=True, verbose_name=b'Date Completed')),
                ('amount', models.DecimalField(verbose_name=b'Amount', max_digits=20, decimal_places=2)),
                ('approved_by', models.CharField(max_length=1000, verbose_name=b'Approved By')),
                ('swift_ref', models.CharField(verbose_name=b'Swift Ref.', max_length=16, editable=False)),
                ('form_a_ref', models.CharField(max_length=20, null=True, verbose_name=b'Form A Ref.')),
                ('approval_file', models.FileField(null=True, upload_to=nostro_chgs_form_a.models.get_file_path, blank=True)),
                ('acct', models.ForeignKey(verbose_name=b'Account', to='adhocmodels.NostroAccount')),
            ],
            options={
                'db_table': 'nostro_chgs_form_a',
                'verbose_name': 'Nostro Charge Paid Via Form A',
                'verbose_name_plural': 'Nostro Charges Paid Via Form A',
            },
        ),
    ]
