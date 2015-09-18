from django.db import models
from adhocmodels.models import Customer, Currency


class FormM(models.Model):
    number = models.CharField('Number', max_length=13)
    applicant = models.ForeignKey(Customer, verbose_name='Applicant')
    currency = models.ForeignKey(Currency, verbose_name='Currency')
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    date_received = models.DateField('Date Received')

    class Meta:
        app_label = 'letter_of_credit'
        db_table = 'form_m'

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
