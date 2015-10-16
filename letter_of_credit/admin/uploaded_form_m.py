from django.contrib import admin
from letter_of_credit.models import UploadedFormM


class UploadedFormMAdmin(admin.ModelAdmin):
    pass


admin.site.register(UploadedFormM, UploadedFormMAdmin)
