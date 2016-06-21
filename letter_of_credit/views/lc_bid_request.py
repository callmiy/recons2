import json

from rest_framework import generics, pagination
import django_filters

from core_recons.csv_utilities import iso_to_date_obj
from letter_of_credit.models import LcBidRequest, FormM
from letter_of_credit.serializers import LcBidRequestSerializer
import logging
import re
from datetime import date

logger = logging.getLogger('recons_logger')


class LcBidRequestPagination(pagination.PageNumberPagination):
    page_size = 20


class LcBidRequestFilter(django_filters.FilterSet):
    pending = django_filters.MethodFilter()
    mf = django_filters.CharFilter(lookup_type='icontains', name='mf__number')
    applicant = django_filters.CharFilter(name='mf__applicant__id')
    amount = django_filters.CharFilter(name='amount')
    lc_number = django_filters.CharFilter(name='mf__lc__lc_number', lookup_type='icontains')

    class Meta:
        model = LcBidRequest
        fields = ('pending', 'mf', 'applicant', 'amount', 'lc_number',)

    def filter_pending(self, qs, param):
        if not param:
            return qs

        param = True if param == 'true' else False
        return qs.filter(mf__deleted_at__isnull=True, requested_at__isnull=param, deleted_at__isnull=True)


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

    def __init__(self, **kwargs):
        self.created_at = None
        super(LcBidRequestUpdateAPIView, self).__init__(**kwargs)

    def update(self, request, *args, **kwargs):
        # django rest framework does not update auto date field. We store that 'created_at' date field from
        # client and if it has changed, we update it in method perform_update
        self.created_at = request.data.get('created_at')
        logger.info('Updating bid request with incoming data = \n%s', json.dumps(request.data, indent=4))

        if request.data.get('update_goods_description'):
            form_m = FormM.objects.get(number=request.data['form_m_number'])
            logger.info(
                    """Updating bid request: related form M good's description will be updated from:\n"%s" """ %
                    form_m.goods_description)
            form_m.goods_description = request.data['goods_description']
            form_m.save()
        updated_bid_response = super(LcBidRequestUpdateAPIView, self).update(request, *args, **kwargs)
        logger.info('Bid successfully updated with result:\n%s' % json.dumps(updated_bid_response.data, indent=4))
        return updated_bid_response

    def perform_update(self, serializer):
        saved_bid = serializer.save()
        if self.created_at:
            self.created_at = iso_to_date_obj(self.created_at)
            if saved_bid.created_at != self.created_at:
                saved_bid.created_at = self.created_at
                saved_bid.save()
