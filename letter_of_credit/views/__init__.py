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

from letter_of_credit.views.form_m import (
    FormMListCreateAPIView,
    FormMUpdateAPIView,
    FormMHomeView,
    LCIssueListCreateAPIView,
    LCIssueUpdateAPIView,
    LCIssueConcreteListCreateAPIView,
    LCIssueConcreteUpdateAPIView)


class Home(CoreAppsView):
    def get(self, request):
        template_context = {'urls': self.get_core_app_urls()}

        return render(request, 'letter_of_credit/index.html', template_context)
