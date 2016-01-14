from letter_of_credit.models import FormM, LcBidRequest, LCRegister, FormMCover
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
        lc = LCRegister.objects.filter(pk=data)
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
            'amount',
            'mf',
            'form_m_number',
            'applicant',
            'goods_description',
            'downloaded',
            'maturity',
        )
