from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from adhocmodels.models import Currency
from core_recons.models import FxDeal
from core_recons.utilities import get_content_type_id, get_content_type_url
from .form_m import FormM


class LcBidRequest(models.Model):
    mf = models.ForeignKey(FormM, verbose_name='Related Form M', related_name='bids')
    created_at = models.DateField('Date Created', auto_now_add=True)
    requested_at = models.DateField('Date Request To Treasury', blank=True, null=True)
    deleted_at = models.DateField('Date Deleted', blank=True, null=True)
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    rate = models.CharField('Rate', max_length=200, null=True, blank=True)
    bid_letter = models.BooleanField('Bid Letter', default=False)
    credit_approval = models.BooleanField('Credit Approval', default=False)
    docs_complete = models.BooleanField('Documentation Complete', default=False)
    comment = models.TextField('Comment', null=True, blank=True)
    downloaded = models.BooleanField('Downloaded', default=False)
    maturity = models.DateField('Maturity Date', blank=True, null=True)

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

    def ct_id(self):
        return get_content_type_id(self)

    def ct_url(self):
        return get_content_type_url(self)

    def allocations(self):
        return FxDeal.get_allocations_basic(self)

    def sum_allocations(self):
        return sum([allocation['amount_allocated'] for allocation in self.allocations()])

    def sum_utilizations(self):
        return sum([allocation['amount_utilized'] for allocation in self.allocations()])

    def unallocated(self):
        return self.amount - self.sum_allocations()


class ConsolidatedLcBidRequest(models.Model):
    mf = models.ForeignKey(FormM, verbose_name='Related Form M', related_name='consolidated_bids')
    created_at = models.DateField('Date Created', auto_now_add=True)
    requested_at = models.DateField('Date Request To Treasury', blank=True, null=True)
    deleted_at = models.DateField('Date Deleted', blank=True, null=True)
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2)
    initial_outst_amount = models.DecimalField('Initial Outstanding Amount', max_digits=20, decimal_places=2, default=0)
    currency = models.ForeignKey(Currency, verbose_name='Currency')
    rate = models.DecimalField('Rate', max_digits=15, decimal_places=8)
    maturity = models.DateField('Maturity Date', blank=True, null=True)
    goods_category = models.CharField('Category', max_length=200, blank=True, null=True)
    purpose = models.CharField('Purpose', max_length=300, blank=True, null=True)  # if different from goods description
    status = models.CharField('Status', max_length=200)
    account_numb = models.CharField('Account Number', max_length=10, null=True, blank=True)
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object_instance = GenericForeignKey('content_type', 'object_id')

    class Meta:
        db_table = 'consolidated_lc_bid_request'
        app_label = 'letter_of_credit'
        verbose_name = 'Consolidated Lc Bid Request'
        verbose_name_plural = 'Consolidated Lc Bid Request'
