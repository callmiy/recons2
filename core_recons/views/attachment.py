import json
import logging
from copy import deepcopy

from django.core.files.uploadedfile import UploadedFile
from rest_framework import generics
import django_filters
from django_downloadview import ObjectDownloadView
import re
from rest_framework import status
from rest_framework.response import Response
from core_recons.models import Attachment, AttachmentFile
from core_recons.serializers import AttachmentSerializer
from core_recons.serializers.attachment import AttachmentFileSerializer

logger = logging.getLogger('recons_logger')
QUERY_DICT_KEY_RE = re.compile(r'files\[\d+\]')


class AttachmentFilter(django_filters.FilterSet):
    ct = django_filters.CharFilter(name='content_type__pk')
    pk = django_filters.CharFilter(name='object_id')
    not_deleted = django_filters.MethodFilter()

    class Meta:
        model = Attachment
        fields = ('ct', 'pk',)

    def filter_not_deleted(self, qs, param):
        if param == 'true':
            return qs.filter(deleted_at__isnull=True)

        if param == 'false':
            return qs.filter(deleted_at__isnull=False)

        return qs


class AttachmentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AttachmentSerializer
    queryset = Attachment.objects.all()
    filter_class = AttachmentFilter

    def raw_files_to_file_names(self, data):
        """Replaces an InMemoryUploadedFile instance in data with its corresponding file name

        InMemoryUploadedFile is not JSON serializable and so for the purpose of logging JSON data, we replace
        InMemoryUploadedFile with its file name

        :param dict data: a dict containing an item that is a InMemoryUploadedFile instance
        :rtype dict: returns a dict with the item containing the InMemoryUploadedFile
        instance replace with the file name
        """

        the_files = data.get('files', None)

        if the_files:
            the_files = [the_file.name for the_file in the_files]

        data['files'] = the_files
        return data

    def normalize_query_dict_with_files(self, data):
        """Takes query dict containing file list and returns regular dict with files as regular python list

        DRF request.data for this view class is a query dict of the form:
        <QueryDict: {
            u'comment': [u'comment'],
            u'title': [u'title'],
            u'object_id': [u'93'],
            u'files[0]': [<InMemoryUploadedFile: file name (mime type)>],
            u'files[1]': [<InMemoryUploadedFile: file name (mime type)>],
            ...,
            u'files[n]': [<InMemoryUploadedFile: file name (mime type)>],
            u'content_type': [u'/core-app/ct/44']}>
        }

        Note that InMemoryUploadedFile could any subclass of UploadedFile

        We pass above data and return a dict of the form:
        {
            'comment': 'comment',
            'title': 'title',
            'object_id': 'object_id',
            'files': [<InMemoryUploadedFile: file name (mime type)>, <InMemoryUploadedFile: file name (mime type)>, ..],
            'content_type': 'content_type',
        }

        :param data
        """
        returned = {}
        files = []
        has_raw_files = False

        for key in data:
            the_file = data[key]
            if QUERY_DICT_KEY_RE.match(key):
                if isinstance(the_file, UploadedFile):
                    files.append(the_file)
                    has_raw_files = True
            else:
                returned[key] = the_file

        if len(files):
            returned['files'] = files
        return returned, has_raw_files

    def create_attachment_files(self, file_list):
        serializer = AttachmentFileSerializer(data=file_list, many=True, context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.instance

    def create_with_raw_files(self, request, request_data):
        serializer = self.get_serializer(data=request_data, context={request: request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        instance = serializer.instance
        attachment_files = self.create_attachment_files([{'file': f} for f in request_data['files']])
        instance.files.add(*attachment_files)
        serializer = self.get_serializer(instance=instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def create(self, request, *args, **kwargs):
        log_prefix = 'Create new attachments:'
        request_data, has_raw_files = self.normalize_query_dict_with_files(request.data)
        logger.info(
                '%s with incoming data = \n%s',
                log_prefix, json.dumps(self.raw_files_to_file_names(deepcopy(request_data)), indent=4)
        )

        if has_raw_files:
            response = self.create_with_raw_files(request, request_data)
        else:
            response = super(AttachmentListCreateAPIView, self).create(request, *args, **kwargs)

        logger.info('%s attachment created successfully, result is:\n%s', log_prefix,
                    json.dumps(response.data, indent=4))
        return response


class AttachmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer

    def update(self, request, *args, **kwargs):
        log_prefix = 'Update attachment:'
        incoming_data = request.data
        logger.info('%s with incoming data = \n%s', log_prefix, json.dumps(incoming_data, indent=4))
        response = super(AttachmentRetrieveUpdateDestroyAPIView, self).update(request, *args, **kwargs)
        logger.info('%s fx deal updated successfully, result is:\n%s', log_prefix, json.dumps(response.data, indent=4))
        return response


class AttachmentFileListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AttachmentFileSerializer
    queryset = AttachmentFile.objects.all()


class AttachmentFileRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AttachmentFile.objects.all()
    serializer_class = AttachmentFileSerializer


attachment_file_download_view = ObjectDownloadView.as_view(model=AttachmentFile)
