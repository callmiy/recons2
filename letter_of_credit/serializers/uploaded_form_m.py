from rest_framework import serializers
from letter_of_credit.models import UploadedFormM


class UploadedFormMSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UploadedFormM
        field = (
            'ba',
            'mf', 'ccy',
            'fob',
            'cost_freight',
            'goods_description',
            'validity_type',
            'status',
            'applicant',
            'submitted_at',
            'uploaded_at'
        )
