from rest_framework import serializers
from .models import Currency, NostroAccount, LedgerAccount, Customer, RelationshipManager, Branch


class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Customer


class RelationshipManagerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RelationshipManager


class BranchSerializer(serializers.HyperlinkedModelSerializer):
    view_value = serializers.Field(source='view_value', )

    class Meta:
        model = Branch

        fields = ('code', 'name', 'view_value')


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency


class NostroAccountLedgerField(serializers.Field):
    def to_native(self, value):
        if value.exists():
            return {'id': value[0].id, 'number': value[0].number}
        return {'id': None, 'number': None}


class NostroAccountSerializer(serializers.ModelSerializer):
    ledger_acct = NostroAccountLedgerField(source='ledger_acct.all')
    ccy = serializers.RelatedField(source='ccy.code')
    bank = serializers.RelatedField(source='bank.__unicode__')

    class Meta:
        model = NostroAccount
        fields = ('id', 'ledger_acct', 'bank', 'ccy', 'number', 'name',)


class LedgerAccountSerializer(serializers.HyperlinkedModelSerializer):
    external_number = serializers.HyperlinkedRelatedField(view_name='nostroaccount-detail')

    class Meta:
        model = LedgerAccount
        fields = ('url', 'external_number', 'number', 'acct_type', 'ccy', 'name',)
