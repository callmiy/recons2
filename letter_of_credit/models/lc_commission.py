from django.db import models

from letter_of_credit.models import LCRegister


class LcCommission(models.Model):
    lc = models.ForeignKey(LCRegister, verbose_name='LC', related_name='lc_commissions')
    transaction_amount = models.DecimalField('Trxn Amount', max_digits=20, decimal_places=2)
    charge_amount = models.DecimalField('Charge Amount', max_digits=20, decimal_places=2)
    exchange_rate = models.DecimalField('X rate', max_digits=5, decimal_places=2)
    percent_applied = models.DecimalField('% Applied', max_digits=4, decimal_places=2)
    acct_numb = models.CharField('Account', max_length=13, )
    event = models.CharField('Event', max_length=3)
    comment = models.TextField('Event', null=True, blank=True)
    charge_date = models.DateField('Charge Date', )
    created_at = models.DateField('Date Created', auto_now_add=True)
    updated_at = models.DateField('Date Updated', auto_now=True)
    deleted_at = models.DateField('Date Deleted', blank=True, null=True)

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'lc_commission'
        verbose_name = 'Lc Commission'
        verbose_name_plural = 'Lc Commission'

    def lc_number(self):
        return self.lc.lc_number

    lc_number.short_description = 'LC Number'

    def applicant(self):
        return self.lc.applicant

    applicant.short_description = 'Applicant'

    def ccy_code(self):
        return self.lc.ccy_obj.code

    ccy_code.short_description = 'Ccy'

    def transaction_amount_formatted(self):
        return '{:,.2f}'.format(self.transaction_amount)

    transaction_amount_formatted.short_description = 'Transaction Amount'

    def charge_amount_formatted(self):
        return '{:,.2f}'.format(self.charge_amount)

    charge_amount_formatted.short_description = 'Charge Amount'
