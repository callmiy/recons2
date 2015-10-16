from django.contrib import admin
from ibdint.models import IbdInt
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.utils.html import format_html
import datetime
from ajax_select import make_ajax_form


class IbdIntAdmin(admin.ModelAdmin):

    form = make_ajax_form(
        IbdInt,
        {'acct': 'nostro_acct',
         'customer': 'customer'}
    )

    list_display = (
        "lc_number", "customer", "currency", "amountformat", "valdate_in_ca",
        "date_processed", "valdate_in_pl", 'rm_name', 'display_clarec_details',)

    search_fields = (
        "lc_number",
        "customer__name",
        "acct__ccy__code",
        'acct__ccy__name',
        "amount",
        "entry_seq",
        'customer__rel_manager__name',
        'clarec_details',)

    ordering = ('-id', "-valdate_in_pl", "-valdate_in_ca",)

    actions = (
        'write_entries', "mark_as_paid_into_pl_today",
        "mark_as_paid_into_pl_custom_date", 'itf_report',)

    def mark_as_paid_into_pl_today(self, request, queryset):
        rowschanged = queryset.count()
        queryset.update(valdate_in_pl=datetime.date.today())

        msgfrag = "1 ITF interest" if rowschanged == 1 else \
            "%d ITF interests" % rowschanged
        self.message_user(request, "%s Paid into P and L Today!" % msgfrag)
    mark_as_paid_into_pl_today.short_description = \
        'Mark As Paid into P and L Today'

    def mark_as_paid_into_pl_custom_date(self, request, queryset):
        selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        selected_ids = ','.join(selected)

        return redirect(
            "%s?ids=%s" % (reverse('update_date_paid_into_pl'), selected_ids)
        )
    mark_as_paid_into_pl_custom_date.short_description =\
        "Mark as paid on custom date"

    def itf_report(self, request, queryset):
        selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
        return redirect('%s?ids=%s' % (
            reverse('itf_report'), ','.join(selected)))
    itf_report.short_description = 'ITF Report For Rel. Manager'

    def write_entries(self, request, queryset):
        posted = []
        unposted = []

        for ibdint in queryset:
            if ibdint.write_posting():
                posted.append((
                    ibdint.lc_number, ibdint.customer.name,
                    ibdint.amountformat()))
            else:
                unposted.append((
                    ibdint.lc_number, ibdint.customer.name,
                    ibdint.amountformat()))
        posted_msg = "Posted: %s" % posted
        unposted_msg = "Unposted: %s" % unposted
        self.message_user(
            request, format_html(
                '<p>{0}<br>total = {2}</p><p>{1}<br>total = {3}</p>',
                posted_msg, unposted_msg, len(posted), len(unposted)))
    write_entries.short_description = 'Prepare for Posting'


# admin.site.register(IbdInt, IbdIntAdmin)
