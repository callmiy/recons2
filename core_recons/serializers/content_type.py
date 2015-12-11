from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType


class ContentTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ContentType
