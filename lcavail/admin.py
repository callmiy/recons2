from django.contrib import admin
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from lcavail.models import LcAvailed, LCCoverMovement
from .forms import lcavail_form
import datetime


class LcAdmin(admin.ModelAdmin):

    form = lcavail_form

    list_display = (
        "lc_number", "currency", "drawing", "swift_bic", "acct_numb",
        "date_negotiated", "date_processed", "avail_date", 'negotiated',
        'displayed_clarec_detail')

    ordering = ("avail_date",)

    search_fields = ("lc_number", "drawn_amt", 'clarec_detail',)

    actions = (
        'process_for_posting', "mark_as_availed_today",
        "mark_as_availed_custom_date",)

    def mark_as_availed_today(self, request, queryset):
        queryset.update(avail_date=datetime.date.today())
        rowschanged = queryset.count()

        msgfrag = "1 lc" if rowschanged == 1 else "%d lcees" % rowschanged
        self.message_user(request, "%s availed today!" % msgfrag)

    mark_as_availed_today.short_description = 'Mark As Availed Today'

    def get_selected_ids(self, request):
        return ','.join(request.POST.getlist(admin.ACTION_CHECKBOX_NAME))

    def mark_as_availed_custom_date(self, request, queryset):
        return HttpResponseRedirect(
            "/lcavail/update-date/avail-date/?ids=%s" %
            self.get_selected_ids(request)
        )
    mark_as_availed_custom_date.short_description =\
        "Mark as availed on custom date"

    def process_for_posting(self, request, queryset):
        unavailed = []
        availed = []
        for lc in queryset:
            if lc.avail():
                availed.append((lc.lc_number, lc.drawing()))
            else:
                unavailed.append((lc.lc_number, lc.drawing()))

        availed_msg = "Marked for posting: %s" % availed
        unavailed_msg = unavailed and "Not marked for posting: %s" % unavailed or ''
        self.message_user(
            request, format_html('{0}<br>{1}', availed_msg, unavailed_msg,))
    process_for_posting.short_description = 'Process For Posting'


class LCCoverMovementAdmin(admin.ModelAdmin):
    list_display = (
        'lc_number', 'amount_fmt', 'acct', 'date_created', 'date_entry_passed',)

    search_fields = (
        'amount',
        'lc_number',
        'acct__number',
        'acct__bank__swift_bic',
        'acct__bank__name',)

    actions = ('process_for_posting',)

    def process_for_posting(self, request, queryset):
        unavailed = []
        availed = []
        for lc in queryset:
            if lc.post():
                availed.append((lc.lc_number, lc.amount_fmt()))
            else:
                unavailed.append((lc.lc_number, lc.amount_fmt()))

        availed_msg = "Marked for posting: %s" % availed
        unavailed_msg = unavailed and "Not marked for posting: %s" % unavailed or ''
        self.message_user(
            request, format_html('{0}<br>{1}', availed_msg, unavailed_msg,))
    process_for_posting.short_description = 'Process For Posting'


admin.site.register(LcAvailed, LcAdmin)
admin.site.register(LCCoverMovement, LCCoverMovementAdmin)
