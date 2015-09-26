from rest_framework import generics, status
from rest_framework.response import Response
from unmatched.models import UnmatchedClarec
from unmatched.serializers import ClirecSerializer
import logging

logger = logging.getLogger('recons_logger')


class UnmatchedClirecListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ClirecSerializer
    queryset = UnmatchedClarec.objects.all()
    filter_fields = ('nostro', 'swift_flex', 'dr_cr', 'show',)

    def remove_non_unique(self, data_list):
        """
        Removes records that have been previously uploaded and
        matches off records that have been matched off by RECONS department.
        """
        fresh_record_list = []
        exclusion_query_fields = {
            'post_date__in': set(),
            'valdate__in': set(),
            'amount__in': set(),
            'details__in': set()
        }
        nostro = None

        for data in data_list:
            check_unique = data.get('check_unique')
            if check_unique == 'check_unique':
                del data[check_unique]

                post_date = data['post_date']
                valdate = data['valdate']
                details = data['details'].strip(' \n\r\t')
                amount = data['amount']
                nostro = data['nostro']

                exclusion_query_fields['post_date__in'].add(post_date)
                exclusion_query_fields['valdate__in'].add(valdate)
                exclusion_query_fields['amount__in'].add(amount)
                exclusion_query_fields['details__in'].add(details)

                clirecs = UnmatchedClarec.objects.filter(
                    post_date=post_date,
                    valdate=valdate,
                    details=details,
                    amount=amount,
                    nostro=data['nostro'],
                    swift_flex=data['swift_flex'],
                    dr_cr=data['dr_cr']
                )
                if clirecs.exists():
                    # This clirec was uploaded previously, so do not add it to the list of fresh records.
                    continue
            fresh_record_list.append(data)

        # this part is needed to automatically match off records. This is the algorithm: If a record
        # is not in this upload, then it must have been matched-off. so I make a query excluding all records
        # in this upload that are not new (uploaded previously) and fetch all records that are still been
        # displayed for this nostro and set those to show=False.

        if len(exclusion_query_fields['post_date__in']):
            for_match_offs = UnmatchedClarec.objects.exclude(**exclusion_query_fields).filter(nostro=nostro, show=True)

            if for_match_offs.exists():
                messages = ''
                pos = 1

                for detail in for_match_offs.values_list('details', flat=True):
                    messages += '%d: %s\n' % (pos, detail)
                    pos += 1

                logger.info('clirec records matched off:\n%s\n\n', messages)
                for_match_offs.update(show=False)

        return fresh_record_list

    def create(self, request, *args, **kwargs):
        messages = ''
        pos = 1
        for datum in request.data:
            messages += '%d: %s\n\n' % (pos, datum)
            pos += 1

        logger.info('Raw clirec data uploaded from client:\n%s\n\n', messages)

        if isinstance(request.data, list):
            data_list = self.remove_non_unique(request.data)
            serializer = self.get_serializer(data=data_list, files=request.FILES, many=True)

        else:
            serializer = self.get_serializer(data=request.data, files=request.FILES)

        if serializer.is_valid():
            self.pre_save(serializer.object)
            self.object = serializer.save(force_insert=True)
            self.post_save(self.object, created=True)
            headers = self.get_success_headers(serializer.data)

            if serializer.data:  # log newly created clirecs only if they exist.
                message = '\n'
                seq = 1

                for datum in serializer.data:
                    message += '%d: %s\n\n' % (seq, datum)
                    seq += 1

                logger.info('Newly created clirec records:\n%s', message)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnmatchedClirecUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UnmatchedClarec.objects.all()
    serializer_class = ClirecSerializer

    def destroy(self, request, *args, **kwargs):
        multiple_delete_ids = request.data.get('multiple_delete_ids', None)

        if multiple_delete_ids is None:
            return super(UnmatchedClirecUpdateAPIView, self).destroy(request, *args, **kwargs)

        else:  # do not delete, but mark has not shown.
            deleted_ids = []
            for obj in self.queryset.filter(pk__in=multiple_delete_ids):
                deleted_ids.append(obj.pk)
                obj.show = False
                obj.save()

            return Response(data={'deleted_ids': deleted_ids})
