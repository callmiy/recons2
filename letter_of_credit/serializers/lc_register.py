from adhocmodels.serializers import CustomerSerializer, CurrencySerializer
from letter_of_credit.models import LCRegister
from rest_framework import serializers
from .form_m import LCIssueConcreteSerializer


class LetterOfCreditRegisterSerializer(serializers.HyperlinkedModelSerializer):
    applicant_data = CustomerSerializer(required=False, read_only=True)
    ccy_data = CurrencySerializer(required=False, read_only=True)
    issues = LCIssueConcreteSerializer(read_only=True, many=True)

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
            'ccy_data',
            'advising_bank',
            'lc_amt_org_ccy',
            'description',
            'ba',
            'issues',
            # </editor-fold>
        )
