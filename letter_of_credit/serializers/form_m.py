from letter_of_credit.models import FormM, LCRegister, FormMCover
from rest_framework import serializers
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer


class FormMCoverSerializer(serializers.HyperlinkedModelSerializer):
    cover_label = serializers.ReadOnlyField(source='get_cover_type_display')

    class Meta:
        model = FormMCover
        fields = (
            'mf',
            'amount',
            'cover_type',
            'cover_label',
            'received_at',
            'form_m_number',
            'currency',
            'applicant',
            'lc_number',
            'id',
            'url',
        )


class FormMLcRelatedField(serializers.RelatedField):
    def to_internal_value(self, data):
        if not data:
            return None

        lc = LCRegister.objects.filter(lc_number=data)
        if lc.exists():
            return lc[0]
        else:
            return None

    def to_representation(self, value):
        return value and value.lc_number or None


class FormMSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, read_only=True)
    currency_data = CurrencySerializer(required=False, read_only=True)
    lc = FormMLcRelatedField(queryset=LCRegister.objects.all(), required=False)

    class Meta:
        model = FormM
        fields = (
            'id',
            'number',
            'applicant',
            'applicant_data',
            'currency',
            'currency_data',
            'amount',
            'date_received',
            'url',
            'goods_description',
            'lc',
            'ct_id',
            'ct_url',
        )

    def create(self, validated_data):
        return super(FormMSerializer, self).create(validated_data)

