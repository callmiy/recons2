from django.db import models
from adhocmodels.models import Customer, Currency
from letter_of_credit.models import LCRegister


class LCIssue(models.Model):
    text = models.CharField('Issue Text', max_length=300)

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'lc_issue'
        verbose_name = 'LC Issue'
        verbose_name_plural = 'LC Issue'

    def __unicode__(self):
        return self.text


class FormM(models.Model):
    number = models.CharField('Number', max_length=13, unique=True)
    applicant = models.ForeignKey(Customer, verbose_name='Applicant')
    currency = models.ForeignKey(Currency, verbose_name='Currency')
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    date_received = models.DateField('Date Received')
    lc = models.ForeignKey(LCRegister, null=True, blank=True, verbose_name='LC')
    goods_description = models.CharField('Goods Description', max_length=1000, blank=True, null=True)

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'form_m'
        verbose_name = 'Form M'
        verbose_name_plural = 'Form M'

    def __unicode__(self):
        return '[%s | %s%s | %s]' % (
            self.number,
            self.currency.code,
            '{:,.2f}'.format(self.amount),
            self.applicant.name
        )

    def applicant_data(self):
        return self.applicant

    def currency_data(self):
        return self.currency
