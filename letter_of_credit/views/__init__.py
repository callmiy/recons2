from django.shortcuts import render
from core_recons.views import CoreAppsView
from letter_of_credit.views.lc import (
    LCStatusListCreateAPIView,
    LCStatusUpdateAPIView,
    LetterOfCreditListCreateAPIView,
    LetterOfCreditUpdateAPIView
)

from letter_of_credit.views.lc_register import (
    LetterOfCreditRegisterListCreateAPIView,
    LetterOfCreditRegisterUpdateAPIView,
    LCRegisterUploadView,
    ReleaseTelexView)

from letter_of_credit.views.lc_issue import (
    LCIssueListCreateAPIView,
    LCIssueUpdateAPIView,
    LCIssueConcreteListCreateAPIView,
    LCIssueConcreteUpdateAPIView,
)

from letter_of_credit.views.form_m import (
    FormMListCreateAPIView,
    FormMUpdateAPIView,
    LcBidRequestListCreateAPIView,
    LcBidRequestUpdateAPIView)

from  letter_of_credit.views.download_bids import DownloadBidsView


class AppHomeView(CoreAppsView):
    def get(self, request):
        template_context = {'urls': self.get_core_app_urls()}

        return render(request, 'letter_of_credit/app/index.html', template_context)

    def post(self, request):
        post_data = request.POST
        print 'post data = ', post_data
