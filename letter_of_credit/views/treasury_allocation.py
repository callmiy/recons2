import json
import logging
from rest_framework import generics
import django_filters

from letter_of_credit.models import TreasuryAllocation
from letter_of_credit.serializers import TreasuryAllocationSerializer

logger = logging.getLogger('recons_logger')


class TreasuryAllocationFilter(django_filters.FilterSet):
    # ct = django_filters.CharFilter(name='content_type__pk')
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()

    class Meta:
        model = TreasuryAllocation
        fields = ('pk',)

    def filter_not_deleted(self, qs, param):
        if param == 'true':
            return qs.filter(deleted_at__isnull=True)

        if param == 'false':
            return qs.filter(deleted_at__isnull=False)

        return qs


class TreasuryAllocationListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TreasuryAllocationSerializer
    queryset = TreasuryAllocation.objects.all()
    filter_class = TreasuryAllocationFilter

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new treasury allocation:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(TreasuryAllocationListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s created successfully, result is:\n%s', log_prefix,
                    json.dumps(response.data, indent=4))
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
