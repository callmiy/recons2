from django.db import models
from .lc_bid_request import LcBidRequest


class ConsolidatedLcBidRequest(models.Model):
    @classmethod
    def create_from_lc_bid(cls, lc_bid: LcBidRequest) -> None: ...
