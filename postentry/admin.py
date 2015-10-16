from django.contrib import admin
from .models import EntryContra, Entry, EntryCode, EntryGeneratingTransaction
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
import datetime
from ajax_select import make_ajax_form


class EntryCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'description',)
    search_fields = ('code', 'description',)


class EntryContraAdmin(admin.ModelAdmin):

    form = make_ajax_form(
        EntryContra,
        {'account': 'ledger'})

    list_display = (
        'account', 'amt_fmt', 'dr_cr', 'entry_code', 'entry_gen_trxn_display',
        'narration', 'branch_for_itf_int', 'rm_code', 'date_posted',
        'time_created',)

    ordering = ('date_posted', '-id',)

    search_fields = (
        'amount', 'ref', 'narration', 'date_posted',
        'account__number', 'account__name',)

    actions = (
        'post_entries', 'mark_as_posted_today', 'mark_as_posted_custom_date',)

    def selected(self, request):
        return ','.join(request.POST.getlist(admin.ACTION_CHECKBOX_NAME))

    def post_entries(self, req, qset):
        return HttpResponseRedirect(
            '%s?ids=%s' % (reverse('process-for-posting'), self.selected(req)))
    post_entries.short_description = "Post Entries"

    def mark_as_posted_today(self, request, queryset):
        rowschanged = queryset.count()
        queryset.update(date_posted=datetime.date.today())
        msgfrag = "1 entry" if rowschanged == 1 else "%d entries" % rowschanged
        self.message_user(request, "%s Posted Today!" % msgfrag)
    mark_as_posted_today.short_description = 'Mark As Posted Today'

    def mark_as_posted_custom_date(self, req, qset):
        return HttpResponseRedirect(
            '%s?ids=%s' % (reverse('update-post-date'), self.selected(req)))
    mark_as_posted_custom_date.short_description = 'Mark As Posted Custom Date'


class EntryAdmin(admin.ModelAdmin):
    list_display = ('amt_fmt', 'time_created',)


class EntryGeneratingTransactionAdmin(admin.ModelAdmin):
    list_display = ('short_name', 'description', 'display',)
    search_fields = ('short_name', 'description',)
    actionsn = ('dont_display',)

    def dont_display(self, request, queryset):
        queryset.update(display=False)
        self.message_user(
            request,
            "%d items will no longer be displayed" % queryset.count())
    dont_display.short_description = "Don't Display"

# admin.site.register(EntryContra, EntryContraAdmin)
# admin.site.register(Entry, EntryAdmin)
# admin.site.register(EntryCode, EntryCodeAdmin)
# admin.site.register(EntryGeneratingTransaction, EntryGeneratingTransactionAdmin)
