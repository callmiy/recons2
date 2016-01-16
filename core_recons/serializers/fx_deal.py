from rest_framework import serializers
from core_recons.models import FxDeal


class FxDealSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FxDeal
        fields = (
            'deal_number',
            'currency',
            'amount_allocated',
            'amount_utilized',
            'allocated_on',
            'utilized_on',
            'id',
            'url',
            'content_type',
            'created_at',
            'updated_at',
            'deleted_at',
            'object_id',
        )
