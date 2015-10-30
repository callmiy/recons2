import django_filters
from rest_framework.viewsets import ModelViewSet
from adhocmodels.models import Customer, Currency, RelationshipManager
from adhocmodels.serializers import CustomerSerializer, CurrencySerializer, RelationshipManagerSerializer
from .models import NostroAccount, LedgerAccount, get_default_memos, Branch
from .serializers import NostroAccountSerializer, LedgerAccountSerializer, BranchSerializer
from django.http import HttpResponse
from rest_framework import generics
import json

import logging

logger = logging.getLogger('recons_logger')


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


class CustomerListCreateAPIView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_class = CustomerFilter


class CustomerUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating customer details with incoming data = \n%r', request.DATA)
        return super(CustomerUpdateAPIView, self).update(request, *args, **kwargs)


class BranchFilter(django_filters.FilterSet):
    filter = django_filters.CharFilter(action=Branch.search_param)

    class Meta:
        model = Branch
        fields = ('filter',)


class BranchListCreateAPIView(generics.ListCreateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    filter_class = BranchFilter


class BranchUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating branch details with incoming data = \n%r', request.DATA)
        return super(BranchUpdateAPIView, self).update(request, *args, **kwargs)


class RelationshipManagerListCreateAPIView(generics.ListCreateAPIView):
    queryset = RelationshipManager.objects.all()
    serializer_class = RelationshipManagerSerializer


class RelationshipManagerUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RelationshipManager.objects.all()
    serializer_class = RelationshipManagerSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating relationship manager details with incoming data = \n%r', request.DATA)
        return super(RelationshipManagerUpdateAPIView, self).update(request, *args, **kwargs)


class CurrencyFilter(django_filters.FilterSet):
    code = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = Currency
        fields = ('code',)


class CurrencyListCreateViewSet(generics.ListCreateAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    filter_class = CurrencyFilter
