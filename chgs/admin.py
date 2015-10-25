from django.contrib import admin
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from datetime import date
from .models import Charge
from ajax_select import make_ajax_form


class ChargeAdmin(admin.ModelAdmin):

    form = make_ajax_form(
        Charge,
        {'cr_acct': 'nostro_acct',
         'customer': 'customer',
         'req_bank': 'overseas_bank',
         'ccy': 'ccy'}
    )

    list_display = (
        'lc_number',
        'customer',
        "currency",
        'amountformated',
        'display_req_bank',
        'chg_notification_date',
        'date_processed',
        'tkt_req_date',
        'tkt_mvd_date',
        'display_clirec_details',
    )

    fields = (
        'lc_number', 'customer', 'ccy', 'amount', 'req_bank', 'cr_acct',
        'overseas_ref', 'val_date_adv', 'val_date_dr', 'tkt_req_date',
        'tkt_mvd_date', 'clirec_details', 'swift_txt',)

    ordering = ('-id', '-tkt_req_date', '-val_date_dr',)

    search_fields = (
        "val_date_dr", "ccy__code", 'amount', 'lc_number',
        'req_bank__swift_bic', 'customer__name', 'entry_seq', 'clirec_details',)

    actions = (
        'print_dealers', 'mark_tkt_reqd_today', 'mark_tkt_reqd_custom_date',
        'print_move_instr', 'mark_tkt_moved_today', "mark_moved_custom_date",)

    list_display_links = (
        'amountformated', 'display_req_bank', 'chg_notification_date',)

    def mark_tkt_reqd_today(self, request, queryset):
        queryset.update(tkt_req_date=date.today())
        rowschanged = queryset.count()
        msgfrag = "1 ticket" if rowschanged == 1 else "%d tickets" % rowschanged
        self.message_user(request, "%s requested today!" % msgfrag)
    mark_tkt_reqd_today.short_description = "Mark Ticket as requested Today"

    def mark_tkt_reqd_custom_date(self, request, queryset):
        selected_ids = self.get_selected(request)

        return HttpResponseRedirect(
            "%s?ids=%s" % (reverse('update-tkt-reqd-date'), selected_ids))
    mark_tkt_reqd_custom_date.short_description = \
        "Mark Ticket as Reqd Custom Date"

    def mark_tkt_moved_today(self, request, queryset):
        queryset.update(tkt_mvd_date=date.today())
        rowschanged = queryset.count()
        msgfrag = "1 chg" if rowschanged == 1 else "%d chgs" % rowschanged
        self.message_user(request, "%s moved today!" % msgfrag)
    mark_tkt_moved_today.short_description = "Mark Ticket as Moved Today"

    def mark_moved_custom_date(self, request, queryset):
        selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        selected_ids = ','.join(selected)

        return HttpResponseRedirect(
            "%s?ids=%s" % (reverse('update_date_tkt_mvd'), selected_ids)
        )
    mark_moved_custom_date.short_description = "Mark Ticket as Moved on Custom Date"

    def get_selected(self, request):
        return ','.join(request.POST.getlist(admin.ACTION_CHECKBOX_NAME))

    def print_move_instr(self, request, queryset):
        selected = self.get_selected(request)
        return HttpResponseRedirect(
            "%s?ids=%s" % (reverse(
                'printchgs', kwargs={'reqtype': 'move_instr'}), selected))
    print_move_instr.short_description = "Print Move Instr. - TROPS & CFC"

    def print_dealers(self, request, queryset):
        ids = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)

        for _id in ids[:]:
            if Charge.objects.get(pk=_id).is_zakhem():
                ids.remove(_id)

        return HttpResponseRedirect(
            "%s?ids=%s" % (reverse(
                'printchgs', kwargs={'reqtype': 'dealers'}), ','.join(ids)))
    print_dealers.short_description = "Print Tickets - DEALERS"

# admin.site.register(Charge, ChargeAdmin)
