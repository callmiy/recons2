# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0007_auto_20151024_1002'),
    ]

    operations = [
        migrations.AlterField(
            model_name='formmcover',
            name='mf',
            field=models.ForeignKey(related_name='covers', verbose_name=b'Form M', to='letter_of_credit.FormM'),
        ),
    ]
