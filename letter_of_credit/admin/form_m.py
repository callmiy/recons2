from django.contrib import admin
from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete


class FormMAdmin(admin.ModelAdmin):
    pass


class LCIssueAdmin(admin.ModelAdmin):
    pass


class LCIssueConcreteAdmin(admin.ModelAdmin):
    pass


admin.site.register(FormM, FormMAdmin)
admin.site.register(LCIssue, LCIssueAdmin)
admin.site.register(LCIssueConcrete, LCIssueConcreteAdmin)
