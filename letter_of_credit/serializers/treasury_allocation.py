from rest_framework import serializers
from letter_of_credit.models import TreasuryAllocation
from letter_of_credit.serializers import LcBidRequestSerializer


class TreasuryAllocationSerializer(serializers.HyperlinkedModelSerializer):
    original_request_obj = LcBidRequestSerializer(read_only=True)

    class Meta:
        model = TreasuryAllocation
        fields = (
            'deal_number',
            'currency',
            'transaction_type',
            'product_type',
            'customer_name',
            'customer_name_no_ref',
            'client_category',
            'source_of_fund',
            'fcy_amount',
            'naira_rate',
            'deal_date',
            'settlement_date',
            'id',
            'url',
            'created_at',
            'updated_at',
            'deleted_at',
            'original_request',
            'original_request_obj',
        )
