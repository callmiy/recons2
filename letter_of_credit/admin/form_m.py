from django.contrib import admin
from letter_of_credit.models import FormM, LCIssue, LCIssueConcrete, LcBidRequest


class FormMAdmin(admin.ModelAdmin):
    pass


class LCIssueAdmin(admin.ModelAdmin):
    pass


class LCIssueConcreteAdmin(admin.ModelAdmin):
    pass


class LcBidRequestAdmin(admin.ModelAdmin):
    pass


admin.site.register(FormM, FormMAdmin)
admin.site.register(LCIssue, LCIssueAdmin)
admin.site.register(LCIssueConcrete, LCIssueConcreteAdmin)
admin.site.register(LcBidRequest, LcBidRequestAdmin)
