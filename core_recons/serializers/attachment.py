from rest_framework import serializers
from core_recons.models import Attachment, AttachmentFile


class AttachmentFileSerializer(serializers.HyperlinkedModelSerializer):
    file = serializers.FileField()

    class Meta:
        model = AttachmentFile
        fields = (
            'file',
            'url',
            'download_url',
        )


class FileAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentFile
        fields = (
            'name',
            'download_url',
        )


class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    files = FileAttachmentSerializer(many=True, read_only=True)

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
