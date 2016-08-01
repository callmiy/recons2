import json
import logging
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
import django_filters

from letter_of_credit.models import TreasuryAllocation
from letter_of_credit.serializers import TreasuryAllocationSerializer

logger = logging.getLogger('recons_logger')


class TreasuryAllocationFilter(django_filters.FilterSet):
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()
    consolidated_bids = django_filters.MethodFilter()
    deal_start_date = django_filters.MethodFilter()
    deal_end_date = django_filters.MethodFilter()
    settlement_start_date = django_filters.MethodFilter()
    settlement_end_date = django_filters.MethodFilter()
    ref = django_filters.CharFilter(lookup_type='icontains', name='ref')
    deal_number = django_filters.CharFilter(lookup_type='icontains', name='deal_number')

    class Meta:
        model = TreasuryAllocation
        fields = (
            'pk', 'deal_start_date', 'deal_end_date', 'settlement_start_date', 'settlement_end_date', 'ref',
            'deal_number', 'consolidated_bids',
        )

    def filter_consolidated_bids(self, qs, param):
        """
        :param qs:
        :type param: str
        :return:
        """
        if param:
            return qs.filter(consolidated_bids__in=param.split(','))

        return qs

    def filter_deal_start_date(self, qs, param):
        if param:
            return qs.filter(deal_date__gte=param)

        return qs

    def filter_deal_end_date(self, qs, param):
        if param:
            return qs.filter(deal_date__lte=param)

        return qs

    def filter_settlement_start_date(self, qs, param):
        if param:
            return qs.filter(settlement_date__gte=param)

        return qs

    def filter_settlement_end_date(self, qs, param):
        if param:
            return qs.filter(settlement_date__lte=param)

        return qs


class TreasuryAllocationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TreasuryAllocationSerializer
    queryset = TreasuryAllocation.objects.all()
    filter_class = TreasuryAllocationFilter

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new treasury allocation:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        serializer = self.get_serializer(data=incoming_data, many=isinstance(incoming_data, list))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response = Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        logger.info('%s created successfully, result is:\n%s', log_prefix,
                    JSONRenderer().render(response.data, accepted_media_type='application/json; indent=4')
                    )
        return response


class TreasuryAllocationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TreasuryAllocation.objects.all()
    serializer_class = TreasuryAllocationSerializer

    def update(self, request, *args, **kwargs):
        log_prefix = 'Update treasury allocation:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(TreasuryAllocationRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
        logger.info('%s updated successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response
