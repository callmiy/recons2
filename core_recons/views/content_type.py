from django.contrib.contenttypes.models import ContentType
from rest_framework import generics

from core_recons.serializers import ContentTypeSerializer


class ContentTypeListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ContentTypeSerializer
    queryset = ContentType.objects.all()


class ContentTypeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer
