from django.contrib import admin
from letter_of_credit.models import FormM, LCIssue


class FormMAdmin(admin.ModelAdmin):
    pass


class LCIssueAdmin(admin.ModelAdmin):
    pass


admin.site.register(FormM, FormMAdmin)
admin.site.register(LCIssue, LCIssueAdmin)
