import json

from rest_framework import serializers
from letter_of_credit.models import TreasuryAllocation, ConsolidatedLcBidRequest


class DistributionToConsolidatedFieldSerializer(serializers.Field):
    def to_internal_value(self, data):
        return json.dumps(data)

    def to_representation(self, value):
        return json.loads(value)


class TreasuryAllocationSerializer(serializers.HyperlinkedModelSerializer):
    consolidated_bids = serializers.HyperlinkedRelatedField(
            required=False, many=True, view_name='consolidatedlcbidrequest-detail',
            queryset=ConsolidatedLcBidRequest.objects.all())

    distribution_to_consolidated_bids = DistributionToConsolidatedFieldSerializer(required=False)

    class Meta:
        model = TreasuryAllocation
        fields = (
            'deal_number',
            'currency',
            'transaction_type',
            'product_type',
            'customer_name',
            'customer_name_no_ref',
            'ref',
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
            'consolidated_bids',
            'distribution_to_consolidated_bids',
        )
