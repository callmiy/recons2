from django.shortcuts import render
from core_recons.views import CoreAppsView
from .lc import (
    LCStatusListCreateAPIView,
    LCStatusUpdateAPIView,
)

from .lc_register import (
    LetterOfCreditRegisterListCreateAPIView,
    LetterOfCreditRegisterUpdateAPIView,
    LCRegisterUploadView,
    ReleaseTelexView)

from .lc_issue import (
    LCIssueListCreateAPIView,
    LCIssueUpdateAPIView,
    LCIssueConcreteListCreateAPIView,
    LCIssueConcreteUpdateAPIView,
)

from .form_m import (
    FormMListCreateAPIView,
    FormMUpdateAPIView,
    LcBidRequestListCreateAPIView,
    LcBidRequestUpdateAPIView)

from .download_bids import DownloadBidsView

from .uploaded_form_m import UploadedFormMListCreateAPIView, UploadedFormMUpdateAPIView


class AppHomeView(CoreAppsView):
    def get(self, request):
        template_context = {'urls': self.get_core_app_urls()}

        return render(request, 'letter_of_credit/app/index.html', template_context)

    def post(self, request):
        post_data = request.POST
        print 'post data = ', post_data
