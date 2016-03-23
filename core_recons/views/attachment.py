import json
import logging
from rest_framework import generics
import django_filters

from core_recons.models import Attachment
from core_recons.serializers import AttachmentSerializer

logger = logging.getLogger('recons_logger')


class AttachmentFilter(django_filters.FilterSet):
    ct = django_filters.CharFilter(name='content_type__pk')
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()

    class Meta:
        model = Attachment
        fields = ('ct', 'pk',)

    def filter_not_deleted(self, qs, param):
        if param == 'true':
            return qs.filter(deleted_at__isnull=True)

        if param == 'false':
            return qs.filter(deleted_at__isnull=False)

        return qs


class AttachmentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AttachmentSerializer
    queryset = Attachment.objects.all()
    filter_class = AttachmentFilter

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new fx deal:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(AttachmentListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s fx deal created successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response


class AttachmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer

    def update(self, request, *args, **kwargs):
        log_prefix = 'Update fx deal:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(AttachmentRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
        logger.info('%s fx deal updated successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response
