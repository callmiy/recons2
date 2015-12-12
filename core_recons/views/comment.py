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

    class Meta:
        model = Comment
        fields = ('ct', 'pk',)


class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    filter_class = CommentFilter

    def __init__(self, **kwargs):
        self.log_prefix = 'Create new comment:'
        super(CommentListCreateAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', self.log_prefix, json.dumps(incoming_data, indent=4))
        response = super(CommentListCreateAPIView, self).create(request, *args, **kwargs)
        logger.info('%s comment created successfully, result is:\n%s', self.log_prefix,
                    json.dumps(response.data, indent=4))
        return response


class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def __init__(self, **kwargs):
        self.log_prefix = 'Update/delete comment:'
        super(CommentRetrieveUpdateDestroyAPIView, self).__init__(**kwargs)

    def create(self, request, *args, **kwargs):
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', self.log_prefix, json.dumps(incoming_data, indent=4))
        return super(CommentRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
