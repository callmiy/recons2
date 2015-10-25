from letter_of_credit.models import FormM, LcBidRequest, LCRegister, FormMCover
from rest_framework import serializers
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer
from .lc_issue import LCIssueConcreteSerializerFormM


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
            'lc_number'
        )


class FormMSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, read_only=True)
    currency_data = CurrencySerializer(required=False, read_only=True)
    form_m_issues = LCIssueConcreteSerializerFormM(many=True, read_only=True)
    lc = serializers.HyperlinkedRelatedField(view_name='lcregister-detail', queryset=LCRegister.objects.all(),
                                             required=False)

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
            'form_m_issues',
            'goods_description',
            'lc'
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
            'downloaded'
        )
