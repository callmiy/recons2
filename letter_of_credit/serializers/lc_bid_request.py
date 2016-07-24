from rest_framework import serializers

from letter_of_credit.models import LcBidRequest, ConsolidatedLcBidRequest


class LcBidRequestSerializer(serializers.HyperlinkedModelSerializer):
    currency = serializers.ReadOnlyField(source='mf.currency.code')
    form_m_number = serializers.ReadOnlyField(source='mf.number')
    applicant = serializers.ReadOnlyField(source='mf.applicant.name')
    goods_description = serializers.ReadOnlyField(source='mf.goods_description')

    class Meta:
        model = LcBidRequest
        fields = (
            'id',
            'url',
            'currency',
            'created_at',
            'requested_at',
            'deleted_at',
            'amount',
            'mf',
            'form_m_number',
            'applicant',
            'goods_description',
            'rate',
            'bid_letter',
            'credit_approval',
            'docs_complete',
            'comment',
            'downloaded',
            'maturity',
            'ct_id',
            'ct_url',
            'allocations',
            'sum_allocations',
            'sum_utilizations',
            'unallocated',
        )


class ConsolidatedLcBidRequestSerializer(serializers.HyperlinkedModelSerializer):
    status_label = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = ConsolidatedLcBidRequest
        fields = (
            'id',
            'url',
            'form_m_number',
            'created_at',
            'requested_at',
            'deleted_at',
            'amount',
            'initial_allocated_amount',
            'rate',
            'maturity',
            'goods_category',
            'purpose',
            'status_label',
            'mf',
            'bid_request_urls',
            'sum_bid_requests',
            'sum_allocations',
            'outstanding_amount',
            'treasury_allocations',
            'lc_number',
        )
