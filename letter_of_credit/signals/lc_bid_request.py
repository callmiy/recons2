from django.db.models.signals import post_save
from django.dispatch import receiver

from letter_of_credit.models import LcBidRequest
from letter_of_credit.models.consolidated_lc_bid_request import ConsolidatedLcBidRequest


@receiver(post_save, sender='letter_of_credit.LcBidRequest', dispatch_uid='1468134630.274ulkkcnxnwem05s5k')
def lc_bid_request_finished_saving(sender, **kwargs):
    """

    :type sender: LcBidRequest
    :param sender:
    :param kwargs:
    :return:
    """
    instance = kwargs['instance']  # type: LcBidRequest
    ConsolidatedLcBidRequest.create_from_lc_bid(instance)
