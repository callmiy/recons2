import django_filters
from rest_framework import generics
from letter_of_credit.models import LcStatus
from letter_of_credit.serializers import LCStatusSerializer
import logging

logger = logging.getLogger('recons_logger')


class LcStatusFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = LcStatus
        fields = ('text',)


class LCStatusListCreateAPIView(generics.ListCreateAPIView):
    queryset = LcStatus.objects.all()
    serializer_class = LCStatusSerializer
    filter_class = LcStatusFilter

    def create(self, request, *args, **kwargs):
        logger.info('incoming data = \n%r', request.data)
        return super(LCStatusListCreateAPIView, self).create(request, *args, **kwargs)


class LCStatusUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LcStatus.objects.all()
    serializer_class = LCStatusSerializer

    def update(self, request, *args, **kwargs):
        logger.info('incoming data = \n%r', request.data)
        return super(LCStatusUpdateAPIView, self).update(request, *args, **kwargs)
