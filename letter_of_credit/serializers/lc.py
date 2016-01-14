from letter_of_credit.models import LetterOfCredit, LcStatus
from rest_framework import serializers
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer


class LCStatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LcStatus
        # fields = ('id', 'text', 'url',)


class LetterOfCreditSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, read_only=True)
    ccy_obj = CurrencySerializer(required=False, read_only=True)

    class Meta:
        model = LetterOfCredit
        fields = (
            'url',
            # <editor-fold description=''>
            'lc_ref',
            'applicant_data',
            'applicant',
            'amount',
            'mf',
            'ccy',
            'bid_date',
            'ccy_obj',
            'date_started',
            'date_released',
            'pk',
            'ti_mf',
            # </editor-fold>
        )
