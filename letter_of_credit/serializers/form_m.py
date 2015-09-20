from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete
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


class FormMSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, )
    currency_data = CurrencySerializer(required=False, )

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
        )


class LCIssueConcreteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LCIssueConcrete
        fields = (
            'id',
            'issue',
            'mf',
            'created_at',
            'closed_at',
            'url'
        )
