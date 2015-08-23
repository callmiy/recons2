from .models import UndrawnBal
from rest_framework import serializers


class UndrawnBalSerializer(serializers.ModelSerializer):

    class Meta:
        model = UndrawnBal
        fields = (
            'id',
            'lc_numb',
            'estb_amt_ccy',
            'estb_amt',
            'claim_amt_ccy',
            'claim_amt',
            'surplus_amt_ccy',
            'surplus_amt',
            'customer',
            'source_fund',
            'nostro',
            'formm_numb',
            'rate',
            'ticket_no',
            'unmatched',
        )
