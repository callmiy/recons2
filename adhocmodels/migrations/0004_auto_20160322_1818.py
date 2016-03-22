# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('adhocmodels', '0003_accountnumber_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accountnumber',
            name='acct_id',
            field=models.CharField(max_length=10, verbose_name=b'Customer ID For Acct.'),
        ),
        migrations.AlterField(
            model_name='accountnumber',
            name='nuban',
            field=models.CharField(max_length=10, verbose_name=b'Nuban'),
        ),
        migrations.AlterUniqueTogether(
            name='accountnumber',
            unique_together=set([('nuban', 'currency', 'acct_id')]),
        ),
    ]
