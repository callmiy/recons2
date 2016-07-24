import json

from rest_framework import generics, pagination
import django_filters
from django.db.models import Q
from rest_framework.renderers import JSONRenderer

from letter_of_credit.models import ConsolidatedLcBidRequest, FormM
from letter_of_credit.serializers import ConsolidatedLcBidRequestSerializer
import logging

logger = logging.getLogger('recons_logger')


class ConsolidatedLcBidRequestPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'num_rows'


class ConsolidatedLcBidRequestFilter(django_filters.FilterSet):
    lc_mf_list = django_filters.MethodFilter()
    q = django_filters.MethodFilter()
    pk = django_filters.MethodFilter()
    mf = django_filters.CharFilter(lookup_type='icontains', name='mf__number')
    applicant = django_filters.CharFilter(name='mf__applicant__name')
    amount = django_filters.CharFilter(name='amount')
    lc_number = django_filters.CharFilter(name='mf__lc__lc_number', lookup_type='icontains')

    class Meta:
        model = ConsolidatedLcBidRequest
        fields = ('mf', 'applicant', 'amount', 'lc_number', 'lc_mf_list', 'pk', 'q',)

    def filter_lc_mf_list(self, qs, param):
        refs_mf = []
        refs_lc = []

        for ref in param.split(','):
            ref = ref.upper()
            if ref.startswith('MF'):
                refs_mf.append(ref)
            elif ref.startswith('ILC'):
                refs_lc.append(ref)

        return qs.filter(Q(mf__number__in=refs_mf) | Q(mf__lc__lc_number__in=refs_lc))

    def filter_pk(self, qs, param):
        if param:
            return qs.filter(pk__in=param.split(','))

        return qs

    def filter_q(self, qs, param):
        if param:
            return qs.filter(
                    Q(mf__number__icontains=param) |
                    Q(mf__lc__lc_number__icontains=param) |
                    Q(mf__applicant__name__icontains=param)
            )

        return qs


class ConsolidatedLcBidRequestListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ConsolidatedLcBidRequestSerializer
    queryset = ConsolidatedLcBidRequest.objects.all()
    pagination_class = ConsolidatedLcBidRequestPagination
    filter_class = ConsolidatedLcBidRequestFilter

    def create(self, request, *args, **kwargs):
        log_text = 'Creating new letter of credit bid request:'
        logger.info('%s with incoming data = \n%s', log_text, json.dumps(request.data, indent=4))
        bid_response = super(ConsolidatedLcBidRequestListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s lc bid successfully created. Bid is:\n%s', log_text,
                    JSONRenderer().render(bid_response.data, 'application/json; indent=4'))
        return bid_response


class ConsolidatedLcBidRequestUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ConsolidatedLcBidRequest.objects.all()
    serializer_class = ConsolidatedLcBidRequestSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating bid request with incoming data = \n%s', json.dumps(request.data, indent=4))

        updated_bid_response = super(ConsolidatedLcBidRequestUpdateAPIView, self).update(request, *args, **kwargs)
        logger.info(
                'Bid successfully updated with result:\n%s' % JSONRenderer().render(
                        updated_bid_response.data, 'application/json; indent=4')
        )
        return updated_bid_response
