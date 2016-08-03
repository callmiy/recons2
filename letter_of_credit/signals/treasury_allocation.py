import json

from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from letter_of_credit.models.treasury_allocation import TreasuryAllocation
from letter_of_credit.models.consolidated_lc_bid_request import ConsolidatedLcBidRequest


def add_initial_consolidated_bids(allocation):
    """
    :type allocation: TreasuryAllocation
    :return:
    """
    qs = ConsolidatedLcBidRequest.objects.filter(Q(mf__number=allocation.ref) | Q(mf__lc__lc_number=allocation.ref))

    if qs.exists():
        bid = qs[0]
        allocation.consolidated_bids.add(bid)
        allocation.distribution_to_consolidated_bids = json.dumps({
            bid.id: float(allocation.fcy_amount)
        })
        allocation.save()


@receiver(post_save, sender='letter_of_credit.TreasuryAllocation', dispatch_uid='1468778059.359ulkkcnxnwem05s5k')
def treasury_allocation_finished_saving(sender, **kwargs):
    """

    :type sender: TreasuryAllocation
    :param sender:
    :param kwargs:
    :return:
    """
    instance = kwargs['instance']  # type: TreasuryAllocation

    if kwargs['created']:
        if instance.ref and instance.product_type == 'SPOT':
            add_initial_consolidated_bids(instance)

    else:
        pass
