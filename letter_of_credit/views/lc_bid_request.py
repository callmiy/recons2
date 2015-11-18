import json

from rest_framework import generics, pagination
import django_filters
from letter_of_credit.models import LcBidRequest
from letter_of_credit.serializers import LcBidRequestSerializer
import logging

logger = logging.getLogger('recons_logger')


class LcBidRequestPagination(pagination.PageNumberPagination):
    page_size = 20


class LcBidRequestFilter(django_filters.FilterSet):
    pending = django_filters.MethodFilter()
    mf = django_filters.CharFilter(lookup_type='icontains', name='mf__number')

    class Meta:
        model = LcBidRequest
        fields = ('pending',)

    def filter_pending(self, qs, param):
        if not param:
            return qs

        param = True if param == 'true' else False
        return qs.filter(requested_at__isnull=param)


class LcBidRequestListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LcBidRequestSerializer
    queryset = LcBidRequest.objects.all()
    pagination_class = LcBidRequestPagination
    filter_class = LcBidRequestFilter

    def create(self, request, *args, **kwargs):
        logger.info(
            'Creating new letter of credit bid request with incoming data = \n%s',
            json.dumps(request.data, indent=4)
        )
        return super(LcBidRequestListCreateAPIView, self).create(request, *args, **kwargs)


class LcBidRequestUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LcBidRequest.objects.all()
    serializer_class = LcBidRequestSerializer

    def update(self, request, *args, **kwargs):
        logger.info(
            'Updating letter of credit bid request with incoming data = \n%s',
            json.dumps(request.data, indent=4)
        )
        return super(LcBidRequestUpdateAPIView, self).update(request, *args, **kwargs)
