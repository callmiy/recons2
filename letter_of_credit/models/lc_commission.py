from django.db import models

from letter_of_credit.models import LCRegister


class LcCommission(models.Model):
    lc = models.ForeignKey(LCRegister, null=True, blank=True, verbose_name='LC', related_name='lc_commissions')
    transaction_amount = models.DecimalField('Transaction Amount', max_digits=20, decimal_places=2)
    charge_amount = models.DecimalField('Charge Amount', max_digits=20, decimal_places=2)
    exchange_rate = models.DecimalField('Exchange Rate', max_digits=5, decimal_places=2)
    percent_applied = models.DecimalField('Exchange Rate', max_digits=4, decimal_places=2)
    acct_numb = models.CharField('Account Number', max_length=13,)
    event = models.CharField('Event', max_length=3)
    charge_date = models.DateField('Charge Date', )
    created_at = models.DateField('Date Created', auto_now_add=True)
    updated_at = models.DateField('Date Updated', auto_now=True)
    deleted_at = models.DateField('Date Deleted', blank=True, null=True)

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'lc_commission'
        verbose_name = 'Lc Commission'
        verbose_name_plural = 'Lc Commission'
