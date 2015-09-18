from letter_of_credit.models import FormM
from rest_framework import serializers
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer


class FormMSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False,)
    currency_data = CurrencySerializer(required=False,)

    class Meta:
        model = FormM
        fields = (
            'number',
            'applicant',
            'applicant_data',
            'currency',
            'currency_data',
            'amount',
            'date_received',
        )
