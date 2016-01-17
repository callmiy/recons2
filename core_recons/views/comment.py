import json
import logging
from rest_framework import generics
import django_filters

from core_recons.models import Comment
from core_recons.serializers import CommentSerializer

logger = logging.getLogger('recons_logger')


class CommentFilter(django_filters.FilterSet):
    ct = django_filters.CharFilter(name='content_type__pk')
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()

    class Meta:
        model = Comment
        fields = ('ct', 'pk',)

    def filter_not_deleted(self, qs, param):
        if param == 'true':
            return qs.filter(deleted_at__isnull=True)

        if param == 'false':
            return qs.filter(deleted_at__isnull=False)

        return qs


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_class = CommentFilter

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new comment:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(CommentListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s comment created successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response


class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def update(self, request, *args, **kwargs):
        log_prefix = 'Update comment:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(CommentRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
        logger.info('%s comment updated successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response
