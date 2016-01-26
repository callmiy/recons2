from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from core_recons.utilities import get_generic_related_model_class_str, get_content_type
from adhocmodels.models import Currency
# from letter_of_credit.models.lc_bid_request import LcBidRequest


class FxDeal(models.Model):
    deal_number = models.CharField('Deal Number', max_length=50)
    currency = models.ForeignKey(Currency, verbose_name='Currency')
    amount_allocated = models.DecimalField('Amount Allocated', max_digits=12, decimal_places=2)
    allocated_on = models.DateField('Date Allocated')
    amount_utilized = models.DecimalField('Amount Utilized', max_digits=12, decimal_places=2, null=True, blank=True)
    utilized_on = models.DateField('Date Utilized', null=True, blank=True)
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object_instance = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Time created')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Time updated')
    deleted_at = models.DateTimeField('Time deleted', null=True, blank=True)

    class Meta:
        db_table = 'fx_deal'
        app_label = 'core_recons'
        verbose_name = 'FX Deal'
        verbose_name_plural = 'FX Deal'

    def __unicode__(self):
        return '[{content_type} | deal={deal} | {ccy} | allocated={allocated:,.2f} | utilized={utilized:,.2f}]'.format(
                content_type=self.content_type,
                ccy=self.currency.code,
                allocated=self.amount_allocated,
                utilized=self.amount_utilized or 0,
                deal=self.deal_number
        )

    def save(self, *args, **kwargs):
        if ((self.amount_utilized and not self.utilized_on) or (not self.amount_utilized and self.utilized_on)):
            raise ValueError(
                    "Both amount utilized and date utilized must be specified together, but you only specified one")
        super(FxDeal, self).save(*args, **kwargs)

    def currency_data(self):
        return self.currency

    def related_model_class_str(self):
        return get_generic_related_model_class_str(self)

    @classmethod
    def get_allocations_for(cls, instance):
        return cls.objects.filter(content_type=get_content_type(instance), object_id=instance.id)

    @classmethod
    def get_allocations_basic(cls, instance):
        allocations = []
        for allocation in cls.get_allocations_for(instance):
            allocations.append({
                'deal_number': allocation.deal_number,
                'currency': allocation.currency.code,
                'amount_allocated': allocation.amount_allocated,
                'allocated_on': allocation.allocated_on,
                'amount_utilized': allocation.amount_utilized,
                'utilized_on': allocation.utilized_on,
            })
        return allocations

# class LcBidRequestFxDealManager(models.Manager):
#     def get_queryset(self):
#         return super(LcBidRequestFxDealManager, self).get_queryset().filter(content_type=get_content_type(LcBidRequest))
#
#
# class LcBidRequestFxDeal(FxDeal):
#     objects = LcBidRequestFxDealManager()
#
#     class Meta:
#         proxy = True
