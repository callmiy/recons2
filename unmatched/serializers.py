from .models import UnmatchedRecons, UnmatchedClarec, get_model_name
from rest_framework import serializers
from django.db import models


class UnmatchedReconsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnmatchedRecons


class ClirecGenericObjectRelatedField(serializers.RelatedField):
    """A custom field to use for clirec_obj generic relationship."""

    def to_representation(self, value):
        """Serialize clirec_related object to simple textual representation."""
        if value is None:
            return 'None'
        elif isinstance(value, models.Model):
            return get_model_name(value)


class ClirecSerializer(serializers.ModelSerializer):
    clirec_obj = ClirecGenericObjectRelatedField(queryset=UnmatchedClarec.objects.all())
    url = serializers.ReadOnlyField(source='get_url', )

    class Meta:
        model = UnmatchedClarec
        fields = (
            "clirec_obj",
            "id",
            "content_type",
            "object_id",
            "post_date",
            "valdate",
            "details",
            "amount",
            "lc_number",
            "nostro",
            "swift_flex",
            "dr_cr",
            "show",
            "date_first_uploaded",
            "comment",
            "date_upload_processed",
            'url',
        )
