from django.db import models
from .form_m import FormM


class LcBidRequest(models.Model):
    mf = models.ForeignKey(FormM, verbose_name='Related Form M', related_name='bids')
    created_at = models.DateField('Date Created', auto_now_add=True)
    requested_at = models.DateField('Date Request To Treasury', blank=True, null=True)
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    downloaded = models.BooleanField('Downloaded', default=False)

    class Meta:
        db_table = 'lc_bid_request'
        app_label = 'letter_of_credit'
        verbose_name = 'Lc Bid Request'
        verbose_name_plural = 'Lc Bid Request'

    def __unicode__(self):
        return '%s: %s%s' % (self.mf.number, self.mf.currency.code, '{:,.2f}'.format(self.amount))

    def form_m_number(self):
        return self.mf.number

    def applicant(self):
        return self.mf.applicant.name

    def goods_description(self):
        return self.mf.goods_description

    def currency(self):
        return self.mf.currency
