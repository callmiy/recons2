from rest_framework import serializers
from core_recons.models import Attachment, AttachmentFile


class AttachmentFileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AttachmentFile
        fields = (
            'url',
            'download_url',
        )


class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    files = serializers.StringRelatedField(many=True)

    class Meta:
        model = Attachment
        fields = (
            'title',
            'comment',
            'files',
            'id',
            'url',
            'content_type',
            'created_at',
            'deleted_at',
            'object_id',
            'related_model_class_str',
        )
