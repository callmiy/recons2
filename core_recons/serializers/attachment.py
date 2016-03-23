from rest_framework import serializers
from core_recons.models import FxDeal
from adhocmodels.serializers import CurrencySerializer


class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    currency_data = CurrencySerializer(read_only=True)

    class Meta:
        model = FxDeal
        fields = (
            'deal_number',
            'currency',
            'currency_data',
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
            'related_model_class_str',
        )
