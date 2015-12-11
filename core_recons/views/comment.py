from rest_framework import generics
import django_filters

from core_recons.models import Comment
from core_recons.serializers import CommentSerializer


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


class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
