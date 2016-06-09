from django.shortcuts import render
from django.views.generic import View


class UploadLcCommissionView(View):
    LC_COMMISSION_REPORT_MODEL_HEADERS_MAPPING = {
        ''
    }

    def get(self, request):
        return render(request, 'letter_of_credit/lc_commission/lc-commission-upload.html')
