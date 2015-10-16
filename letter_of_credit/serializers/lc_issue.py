from rest_framework import serializers
from letter_of_credit.models import LCIssue, LCIssueConcrete


class LCIssueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LCIssue
        fields = (
            'id',
            'text',
            'url'
        )


class LCIssueConcreteSerializer(serializers.HyperlinkedModelSerializer):
    issue_text = serializers.ReadOnlyField(source='issue.text')

    class Meta:
        model = LCIssueConcrete
        fields = (
            'id',
            'issue',
            'issue_text',
            'mf',
            'created_at',
            'closed_at',
            'url'
        )


class LCIssueConcreteSerializerFormM(serializers.HyperlinkedModelSerializer):
    issue = serializers.ReadOnlyField(source='issue.text')

    class Meta:
        model = LCIssueConcrete
        fields = (
            'id',
            'issue',
            'created_at',
            'closed_at',
            'url'
        )
