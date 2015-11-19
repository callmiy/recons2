import json
import django_filters
from rest_framework import generics
from letter_of_credit.models import FormMCover
from letter_of_credit.serializers import FormMCoverSerializer
import logging

logger = logging.getLogger('recons_logger')


class FormMCoverFilter(django_filters.FilterSet):
    form_m_number = django_filters.CharFilter(name='mf__number', lookup_type='icontains')
    cover_type = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = FormMCover
        fields = ('form_m_number', 'cover_type')


class FormMCoverListCreateAPIView(generics.ListCreateAPIView):
    queryset = FormMCover.objects.all()
    serializer_class = FormMCoverSerializer
    filter_class = FormMCoverFilter

    def create(self, request, *args, **kwargs):
        logger.info('Creating form m cover with incoming data: %s', json.dumps(request.data, indent=4))
        return super(FormMCoverListCreateAPIView, self).create(request, *args, **kwargs)


class FormMCoverRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FormMCover.objects.all()
    serializer_class = FormMCoverSerializer

    def update(self, request, *args, **kwargs):
        logger.info('Updating form m cover with incoming data: %s', json.dumps(request.data, indent=4))
        return super(FormMCoverRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
