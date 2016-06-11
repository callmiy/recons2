# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter_of_credit', '0017_lccommission_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lccommission',
            name='lc',
            field=models.ForeignKey(related_name='lc_commissions', default='', verbose_name=b'LC', to='letter_of_credit.LCRegister'),
            preserve_default=False,
        ),
    ]
