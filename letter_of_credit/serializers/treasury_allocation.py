import json

from rest_framework import serializers
from letter_of_credit.models import TreasuryAllocation, ConsolidatedLcBidRequest


class DistributionToConsolidatedFieldSerializer(serializers.Field):
    def to_internal_value(self, data):
        internal_value = {}

        for bid in data:
            internal_value[bid['id']] = bid['portion_of_allocation']

        return json.dumps(internal_value)

    def to_representation(self, value):
        bid_distribution = json.loads(value)

        if len(bid_distribution) == 0:
            return []

        returned = []

        for bid_id in bid_distribution:
            bid = ConsolidatedLcBidRequest.objects.get(pk=bid_id)
            returned.append({
                'id': bid_id,
                'url': bid.url(),
                'portion_of_allocation': bid_distribution[bid_id],
                'sum_bid_requests': bid.sum_bid_requests(),
                'sum_allocations': bid.sum_allocations(),
                'outstanding_amount': bid.outstanding_amount(),
                'form_m_number': bid.form_m_number(),
            })

        return returned


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
