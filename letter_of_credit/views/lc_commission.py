from django.shortcuts import render
from django.views.generic import View


class UploadLcCommissionView(View):
    def get(self, request):
        return render(request, 'letter_of_credit/process_swift/process_swift.html')
