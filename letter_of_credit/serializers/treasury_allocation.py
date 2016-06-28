from rest_framework import serializers
from letter_of_credit.models import TreasuryAllocation


class TreasuryAllocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TreasuryAllocation
        fields = (
            'deal_number',
            'currency',
            'transaction_type',
            'product_type',
            'customer_name',
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
        )
