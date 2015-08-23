from django.conf.urls import url, patterns
from contingent_report.views.uploads import LCRegisterUpdateView
from .views import (UploadContingentReportView,
                    TIPostingStatusUploadView,
                    TIFlexDatePromptView,
                    ContingentBalancesViewRiskMgmt,
                    OutStandingLCBalances, )
from contingent_report.views.contingent_postings import PostContingentView

# uploads
urlpatterns = patterns(
    # <editor-fold description='uploads'>
    '',
    url(
        r'^uploads/contingent/(?P<acct_status>.+/)?$',
        UploadContingentReportView.as_view(),
        name='upload-contingent'),

    url(r'^uploads/contingent2/$',
        TIFlexDatePromptView.as_view(),
        name='upload-contingent2'),

    url(r'^uploads/ti-posting-status/$', TIPostingStatusUploadView.as_view(),
        name='upload_ti_posting_status'),

    url(r'^uploads/lc-register/update$',
        LCRegisterUpdateView.as_view(), name='update_lc_register'),
    # </editor-fold>
)

# reports and others
urlpatterns += patterns(
    '',

    url(r'^contingent-balances-risk/$', ContingentBalancesViewRiskMgmt.as_view(), name='contingent-balances-risk'),

    url(r'^reports/contingent-lc-bals/$', OutStandingLCBalances.as_view(), name='contingent-lc-bals'),
)

# Postings
urlpatterns += patterns(
    "",
    url(r"^adhoc-contingent-posting/$", PostContingentView.as_view(), name="adhoc-contingent-posting")
)
