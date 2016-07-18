import json

from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from letter_of_credit.models.treasury_allocation import TreasuryAllocation
from letter_of_credit.models.consolidated_lc_bid_request import ConsolidatedLcBidRequest


@receiver(post_save, sender='letter_of_credit.TreasuryAllocation', dispatch_uid='1468778059.359ulkkcnxnwem05s5k')
def treasury_allocation_finished_saving(sender, **kwargs):
    """

    :type sender: TreasuryAllocation
    :param sender:
    :param kwargs:
    :return:
    """
    instance = kwargs['instance']  # type: TreasuryAllocation

    if kwargs['created'] and instance.ref:
        qs = ConsolidatedLcBidRequest.objects.filter(Q(mf__number=instance.ref) | Q(mf__lc__lc_number=instance.ref))

        if qs.exists():
            bid = qs[0]
            instance.consolidated_bids.add(bid)
            instance.distribution_to_consolidated_bids = json.dumps({
                bid.id: float(instance.fcy_amount)
            })
            instance.save()
