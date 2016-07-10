import json

from django.db import models

from letter_of_credit.models import ConsolidatedLcBidRequest


class TreasuryAllocation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Time created')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Time updated')
    deleted_at = models.DateTimeField('Time deleted', null=True, blank=True)
    deal_number = models.CharField('Deal Number', max_length=50)
    transaction_type = models.CharField('Transaction Type', max_length=50)
    product_type = models.CharField('Product Type', max_length=50, null=True, blank=True)
    customer_name = models.CharField('Customer Name With Ref', max_length=300)
    customer_name_no_ref = models.CharField('Customer Name', max_length=300, null=True, blank=True)
    ref = models.CharField('REF', max_length=20, null=True, blank=True)
    client_category = models.CharField('Client Category', max_length=200)
    source_of_fund = models.CharField('Source of fund', max_length=20, null=True, blank=True)
    currency = models.CharField('Currency', max_length=3)
    fcy_amount = models.DecimalField('FCY Amount', max_digits=12, decimal_places=2)
    naira_rate = models.DecimalField('Naira rate', max_digits=9, decimal_places=4)
    deal_date = models.DateField('Deal Date')
    settlement_date = models.DateField('Settlement Date')
    consolidated_bids = models.ManyToManyField(
            ConsolidatedLcBidRequest,
            verbose_name='Related Consolidated Bids',
            related_name='treasury_allocations',
            blank=True,
    )
    # Ideally, a treasury allocation object should be tied to a consolidated bid object. But in reality, business may
    #  take the decision to tie a treasury allocation object to 2 or more consolidated bid object. This field will
    # then be a mapping from the consolidated bid object database ID to the proportion of the amount of the
    # treasury allocation object that will be tied to this consolidated bid object. This field will look like so:
    # {
    #   id (of a consolidated bid): amount (that will be utilized by that consolidated bid), id: amount
    # }
    distribution_to_consolidated_bids = models.TextField(
            'Mapping from ID to amount distributed to a consolidated bid object', default='{}')

    class Meta:
        db_table = 'treasury_allocation'
        app_label = 'letter_of_credit'
        verbose_name = 'Treasury Allocation'
        verbose_name_plural = 'Treasury Allocation'
        unique_together = ('deal_number', 'deal_date', 'transaction_type',)

    def save(self, *args, **kwargs):
        self.customer_name = self.customer_name.strip(' \n\t\r\v"')
        super(TreasuryAllocation, self).save(*args, **kwargs)

    def fcy_amount_formatted(self):
        sign = '-' if self.transaction_type.lower() == 'sale' else ''
        return '{}{:,.2f}'.format(sign, self.fcy_amount)

    fcy_amount_formatted.short_description = 'FCY Amount'

    def distribution_to_consolidated_bids_to_dict(self):
        return json.loads(self.distribution_to_consolidated_bids)
