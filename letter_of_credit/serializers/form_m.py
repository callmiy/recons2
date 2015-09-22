from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete, LcBidRequest
from rest_framework import serializers
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer


class LCIssueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LCIssue
        fields = (
            'id',
            'text',
            'url'
        )


class LCIssueConcreteSerializer(serializers.HyperlinkedModelSerializer):
    issue_text = serializers.ReadOnlyField(source='issue.text')

    class Meta:
        model = LCIssueConcrete
        fields = (
            'id',
            'issue',
            'issue_text',
            'mf',
            'created_at',
            'closed_at',
            'url'
        )


class LCIssueConcreteSerializerFormM(serializers.HyperlinkedModelSerializer):
    issue = serializers.ReadOnlyField(source='issue.text')

    class Meta:
        model = LCIssueConcrete
        fields = (
            'id',
            'issue',
            'created_at',
            'closed_at',
            'url'
        )


class FormMSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, read_only=True)
    currency_data = CurrencySerializer(required=False, read_only=True)
    form_m_issues = LCIssueConcreteSerializerFormM(many=True, read_only=True)

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
        )


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
        )
