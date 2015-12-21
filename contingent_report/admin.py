from django.contrib import admin, messages
from django.utils.html import format_html
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.db.models import Sum
from .models import (
    ContingentReport,
    TIPostingStatusReport,
    TIFlexRecons,
    LCClass,
    ContingentAccount,
)


class LCClassAdmin(admin.ModelAdmin):
    list_display = ('prod_code', 'desc')


admin.site.register(LCClass, LCClassAdmin)


class ContingentReportAdmin(admin.ModelAdmin):
    list_display = (
        'flex_ref',
        'ti_ref',
        'acct_numb',
        'customer_name',
        'booking_date',
        'liq_date',
        'ccy',
        'fx_amt_fmt',
        'ngn_amt_fmt',
    )

    search_fields = (
        'flex_ref',
        'ti_ref',
        'fx_amt',
        'ngn_amt',
        'acct_numb__gl_code',
        'booking_date',
    )

    ordering = ('-booking_date', 'ti_ref',)
    actions = ('get_outstanding', 'reverse_posting',)

    def queryset(self, request):
        return ContingentReport.objects.exclude(flex_module='RE')

    def get_outstanding(self, request, queryset):
        lcees = set([q.ti_ref for q in queryset])
        if len(lcees) > 1:
            self.message_user(
                    request,
                    message='You can only get Contingent Bal. for one lc, got : %s'
                            % list(lcees),
                    level=messages.ERROR, fail_silently=False)
            return

        ccys = set([q.ccy for q in queryset])
        if len(ccys) > 1:
            self.message_user(
                    request,
                    message='You can only get Contingent Bal. for same ccy, got: %s'
                            % list(ccys),
                    level=messages.ERROR, fail_silently=False)
            return

        ca_bal = '{:,.2f}'.format(queryset.filter(acct_numb__acct_class='ASSET').aggregate(bal=Sum('fx_amt'))['bal'])
        cl_bal = '{:,.2f}'.format(
                queryset.filter(acct_numb__acct_class='LIABILITY').aggregate(bal=Sum('fx_amt'))['bal']
        )

        self.message_user(
                request, format_html(
                        'Outstanding Bals {2}:<br>CA={0}<br>CL={1}', ca_bal, cl_bal, tuple(lcees)[0])
        )

    get_outstanding.short_description = 'Outstanding Balance'

    def reverse_posting(self, request, queryset):
        selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)

        return redirect(
                '%s?ids=%s' % (reverse('reverse-cont-posting'), ','.join(selected)))

    reverse_posting.short_description = 'Write Reverse Posting'


class ContingentAccountAdmin(admin.ModelAdmin):
    list_display = ('gl_code', 'ccy', 'in_use', 'acct_class')


admin.site.register(ContingentAccount, ContingentAccountAdmin)


class TIPostingStatusReportAdmin(admin.ModelAdmin):
    list_display = (
        'ref', 'posting_date', 'acct_number', 'ccy', 'amount_formatted',
        'applicant', 'post_success',)
    search_fields = ('ref', 'applicant', 'mf', 'ba', 'amount', 'acct_number', 'narration')
    actions = ('mark_posted', 'sum_up',)

    def sum_up(self, request, queryset):
        valid_acct_starts = ('LI', "IN",)

        income_acct = lambda acct: acct and (acct.isdigit() or
                                             acct[:2] in valid_acct_starts)
        contingent_acct = lambda acct: not acct or acct.startswith('C')

        q = queryset[0]
        acct = q.acct_number
        ref = q.ref
        refs = []
        ccy = q.ccy
        ccys = []
        total = 0

        for cont in queryset:
            refs.append(cont.ref)
            ccys.append(cont.ccy)

            if income_acct(acct) and contingent_acct(acct):
                self.message_user(
                        request,
                        message='Account Number incorrect',
                        level=messages.ERROR, fail_silently=False)
                return

            if cont.ref != ref:
                self.message_user(
                        request,
                        message='Ref must be the same, got: %r' %
                                set(refs),
                        level=messages.ERROR, fail_silently=False)
                return

            elif cont.ccy != ccy:
                self.message_user(
                        request,
                        message='Currencies Must be the same, got: %r' %
                                set(ccys),
                        level=messages.ERROR, fail_silently=False)
                return
            else:
                total += cont.amount
        self.message_user(
                request, 'Sum Amounts = %s' % '{:,.2f}'.format(total))

    sum_up.short_description = 'Get Sum Amounts'

    def mark_posted(self, request, queryset):
        num = queryset.count()
        for obj in queryset:
            if obj.comment:
                obj.comment = '%s\nSUCCESS' % obj.comment
            else:
                obj.comment = 'SUCCESS'
            obj.save()
        frag = 'TI posting' if num == 1 else 'TI postings'
        self.message_user(request, '%d %s manually posted' % (num, frag))

    mark_posted.short_description = 'Post Manually'


class TIFlexReconsAdmin(admin.ModelAdmin):
    list_display = (
        'flex_ref', 'ti_ref', 'acct_numb', 'ccy', 'dr_cr', 'fcy_fmt',
        'lcy_fmt', 'val_date')
    search_fields = ('ti_ref', 'flex_ref', 'acct_numb', 'fcy_amt', 'val_date',)
    ordering = ('ti_ref',)

    # def queryset(self, request):
    #     q = TIFlexRecons.objects.filter(acct_numb__startswith='CA')
    #     return q


admin.site.register(ContingentReport, ContingentReportAdmin)
admin.site.register(TIPostingStatusReport, TIPostingStatusReportAdmin)
admin.site.register(TIFlexRecons, TIFlexReconsAdmin)
