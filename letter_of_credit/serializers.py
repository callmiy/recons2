from adhocmodels.serializers import CustomerSerializer, CurrencySerializer
from letter_of_credit.models import LetterOfCredit, LcStatus, LCRegister
from rest_framework import serializers


class LCStatusSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LcStatus
        # fields = ('id', 'text', 'url',)


class LetterOfCreditSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False)
    ccy_obj = CurrencySerializer(required=False)

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
            'id',
            'ti_mf',
            # </editor-fold>
        )


class LetterOfCreditRegisterSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False)
    ccy_data = CurrencySerializer(required=False)

    class Meta:
        model = LCRegister
        fields = (
            'id',
            # <editor-fold description=''>
            'url',
            'lc_number',
            'mf',
            'date_started',
            'estb_date',
            'expiry_date',
            'applicant',
            'applicant_data',
            'bene',
            'ccy',
            'ccy_data',
            'advising_bank',
            'lc_amt_org_ccy',
            'description',
            'ba',
            # </editor-fold>
        )
