from django.core.urlresolvers import reverse
from django.db import models

from letter_of_credit.letter_of_credit_commons import BidRequestStatus
from .form_m import FormM
import json


class ConsolidatedLcBidRequest(models.Model):
    CASH_BACKED = 0
    MATURED_OBLIGATION = 1
    LIQUIDITY_FUNDING = 2
    STATUSES = (
        (CASH_BACKED, 'CASH BACKED'),
        (MATURED_OBLIGATION, 'MATURED OBLIGATION'),
        (LIQUIDITY_FUNDING, 'LIQUIDITY FUNDING'),
    )

    mf = models.ForeignKey(FormM, verbose_name='Related Form M', related_name='consolidated_bids')
    created_at = models.DateField('Date Created', auto_now_add=True)
    requested_at = models.DateField('Date Request To Treasury', blank=True, null=True)
    deleted_at = models.DateField('Date Deleted', blank=True, null=True)
    amount = models.DecimalField('Amount', max_digits=20, decimal_places=2, default=0)

    # new balance = amount - initial_allocated_amount - (new allocation from treasury allocation object represented by
    #  the 'allocations' field below)
    initial_allocated_amount = models.DecimalField(
            'Initial Allocated Amount', max_digits=20, decimal_places=2, default=0)

    rate = models.CharField('Rate', max_length=200, null=True, blank=True)
    maturity = models.DateField('Maturity Date', blank=True, null=True)
    goods_category = models.CharField('Category', max_length=200, blank=True, null=True)
    purpose = models.CharField('Purpose', max_length=300, blank=True, null=True)  # if different from goods description
    status = models.SmallIntegerField('Status', choices=BidRequestStatus.STATUSES)
    account_numb = models.CharField('Account Number', max_length=10, null=True, blank=True)

    class Meta:
        db_table = 'consolidated_lc_bid_request'
        app_label = 'letter_of_credit'
        verbose_name = 'Consolidated Lc Bid Request'
        verbose_name_plural = 'Consolidated Lc Bid Request'
        unique_together = ('mf', 'status',)

    def __unicode__(self):
        return self.mf.__unicode__()

    def get_allocations_dict(self):
        return json.loads(self.allocations)

    def sum_allocations(self):
        current_allocations = 0
        pk = str(self.pk)

        for allocation in self.treasury_allocations.all():
            allocation_dict = allocation.distribution_to_consolidated_bids_to_dict()
            if pk in allocation_dict:
                current_allocations += float(allocation_dict[pk])

        return float(self.initial_allocated_amount) + current_allocations

    def outstanding_amount(self):
        return self.sum_bid_requests() - self.sum_allocations()

    def form_m_number(self):
        return self.mf.number

    def customer_name(self):
        return self.mf.applicant_name()

    def currency(self):
        return self.mf.currency.code

    def goods_description(self):
        return self.purpose or self.mf.goods_description

    def sum_bid_requests(self):
        return float(sum([x.amount for x in self.bid_requests()]))

    def bid_requests(self):
        if self.mf.deleted_at:
            return []
        return self.mf.bids.filter(deleted_at__isnull=True, requested_at__isnull=False)

    def bid_request_urls(self):
        return [x.url() for x in self.bid_requests()]

    def diff_amount_requests(self):  # TODO: to be removed when deployed to production and data is certified stable
        if self.amount:
            return float(self.amount) - self.sum_bid_requests()
        return 0

    def lc_number(self):
        lc = self.mf.lc
        if lc:
            return lc.lc_number
        return None

    def url(self):
        return reverse(
                'consolidatedlcbidrequest-detail',
                kwargs={
                    'pk': self.pk
                }
        )

    @classmethod
    def create_from_lc_bid(cls, lc_bid):
        """Create consolidated Lc bid request from an Lc bid request instance.

        But the consolidated bid request instance will only be created if
        1. there is no existing instance with same mf number as the lc bid request instance passed in as argument
        2. the lc bid request instance has been requested (its requested_at attribute is not None)

        :type lc_bid: LcBidRequest
        :param lc_bid: The Lc bid request instance from which a consolidated Lc bid request will be created
        """
        requested_at = lc_bid.requested_at

        if requested_at:
            mf = lc_bid.mf
            cons = cls.objects.filter(mf__number=mf.number)

            if not cons.exists():
                cls.objects.create(
                        requested_at=requested_at,
                        mf=mf,
                        amount=lc_bid.amount,
                        rate=lc_bid.rate,
                        status=lc_bid.status
                )
