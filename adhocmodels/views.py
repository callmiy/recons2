import django_filters
from rest_framework.viewsets import ModelViewSet
from adhocmodels.models import Customer, Currency
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer
from .models import NostroAccount, LedgerAccount, get_default_memos
from .serializers import NostroAccountSerializer, LedgerAccountSerializer
from django.http import HttpResponse
from rest_framework import filters
from rest_framework import generics
import json


def get_default_memos_view(request):
    if request.method == 'GET':
        ccy = request.GET.get('ccy')
        if ccy is not None:
            return HttpResponse(json.dumps(get_default_memos()[ccy.upper()]))
        return HttpResponse(json.dumps(get_default_memos()))


class NostroAccountViewSet(ModelViewSet):
    queryset = NostroAccount.objects.all()
    serializer_class = NostroAccountSerializer


class LedgerAccountViewSet(ModelViewSet):
    queryset = LedgerAccount.objects.all()
    serializer_class = LedgerAccountSerializer


class CustomerFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(name='name', lookup_type='icontains')

    class Meta:
        model = Customer
        fields = ('name',)


class CustomerListCreateViewSet(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_class = CustomerFilter


class CurrencyFilter(django_filters.FilterSet):
    code = django_filters.CharFilter(lookup_type='iexact')

    class Meta:
        model = Currency
        fields = ('code',)


class CurrencyListCreateViewSet(generics.ListCreateAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    filter_class = CurrencyFilter

