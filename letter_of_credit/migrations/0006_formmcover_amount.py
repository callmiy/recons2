# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0005_formmcover'),
    ]

    operations = [
        migrations.AddField(
            model_name='formmcover',
            name='amount',
            field=models.DecimalField(null=True, verbose_name=b'Cover Amount', max_digits=20, decimal_places=2),
        ),
    ]
