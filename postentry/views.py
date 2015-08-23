from django.http import HttpResponse
from django.http import Http404
from django.shortcuts import render
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required
from .models import EntryContra
from xlwt import Workbook
from datetime import datetime, date
import json


class PostingView(View):

    def get(self, request):
        context = {}
        _ids = request.GET.get('ids')

        if _ids:
            ids = _ids.split(',')
            contras = EntryContra.objects.filter(id__in=ids).order_by('-id')
            entries_summary = self.do_post_summary(contras)
            context.update(
                {'entries_summary': entries_summary,
                 'conts': contras, 'ids': ids, 'update_post_url': 'kanmii'}
            )

        return render(
            request, 'postentry/post-entries.html', context)

    def post(self, request):
        ids = request.GET['ids']
        contras = EntryContra.objects.filter(
            id__in=ids.split(',')).order_by('-id')
        xl = self.write_entries_to_xl(contras)

        response = HttpResponse()
        response['Content-Type'] = 'application/xls'
        response['Content-Disposition'] = 'attachment;filename="entries.xls"'
        xl.save(response)
        return response

    @method_decorator(permission_required('postentry.can_create_adhoc_post'))
    def dispatch(self, request, *args, **kwargs):
        return super(PostingView, self).dispatch(request, *args, **kwargs)

    def do_post_summary(self, contras):
        numb_posts = 'TOTAL ENTRIES PROCESSED FOR POSTING: %d' % contras.count()

        total_dr = sum([cont.amount for cont in contras if cont.amount < 0])
        total_cr = sum([cont.amount for cont in contras if cont.amount >= 0])

        return """
        {number_posted}\n\tDR: {total_dr}\tCR: {total_cr}\nBalanced?: {balanced}
        """.strip('\n ').format(
            number_posted=numb_posts,
            total_dr=total_dr,
            total_cr=total_cr,
            balanced=(total_dr + total_cr) == 0)

    def write_xl_row(self, row_vals_list, to_row):
        [self.xlsh.write(to_row, col, val)
         for col, val in enumerate(row_vals_list)]

    def write_batch_no_and_headers(self):
        batch_no_header = ('', '', '', '', '', 'BATCH adk')
        headers = ("S/N", "ACCOUNT", "AMOUNT", "CR/DR", "TYPE OF ENTRY",
                   "NARRATION", "REF", "BRANCH FOR ITF INT",)

        self.write_xl_row(batch_no_header, self.row_in_xlsh)
        self.row_in_xlsh += 1

        self.write_xl_row(headers, self.row_in_xlsh)
        self.row_in_xlsh += 1

    def write_entries_to_xl(self, contras):
        xl = Workbook()
        self.xlsh = xl.add_sheet("POSTINGS")
        self.row_in_xlsh = 0

        self.write_batch_no_and_headers()

        sequence = 1
        total_dr, total_cr = 0, 0

        for contra in contras:
            self.write_xl_row(
                (sequence, contra.account.number, abs(contra.amount),
                 contra.dr_cr(), contra.entry_code(), contra.narration,
                 contra.ref, contra.branch_for_itf_int,),
                self.row_in_xlsh)

            sequence += 1
            self.row_in_xlsh += 1
            total_dr += contra.amount if contra.dr_cr() == 'DR' else 0
            total_cr += contra.amount if contra.dr_cr() == 'CR' else 0
            contra.entry.time_processed_for_posting = datetime.now()
            contra.entry.save()

        return xl


def ajax_update_post_status(request):
    ids = request.POST.get('ids')

    if ids:
        today = date.today()
        contras = EntryContra.objects.filter(id__in=json.loads(ids))
        contras.update(date_posted=date.today())
        jsonObj = {}
        for c in contras:
            c.date_posted = today
            c.save()
            jsonObj[c.id] = True
        return HttpResponse(json.dumps(jsonObj))
    raise Http404
