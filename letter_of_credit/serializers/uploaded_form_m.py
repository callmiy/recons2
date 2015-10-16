from rest_framework import serializers
from letter_of_credit.models import UploadedFormM


class UploadedFormMSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UploadedFormM
        field = ('ba', 'mf', 'ccy', 'fob', 'applicant', 'submitted_at', 'validated_at', 'uploaded_at')
