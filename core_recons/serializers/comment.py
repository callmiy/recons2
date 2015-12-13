from rest_framework import serializers
from core_recons.models import Comment


class CommentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Comment
        fields = (
            'id',
            'url',
            'content_type',
            'created_at',
            'updated_at',
            'deleted_at',
            'object_id',
            'text',
        )
