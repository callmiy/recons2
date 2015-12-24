from django.conf.urls import url, patterns
from contingent_report.views.uploads import LCRegisterUpdateView
from .views import (UploadContingentReportView,
                    TIPostingStatusUploadView,
                    TIFlexDatePromptView,
                    ContingentNonPostView,
                    OldContingentBalancesViewRiskMgmt,
                    ContingentBalancesViewRiskMgmt,
                    OutStandingLCBalances, )

# uploads
urlpatterns = patterns(
        '',
        url(r'^uploads/contingent/?$',
            UploadContingentReportView.as_view(),
            name='upload-contingent'),

        url(r'^uploads/ti-flex-recons-date-prompt/$',
            TIFlexDatePromptView.as_view(),
            name='ti-flex-recons-date-prompt-upload'),

        url(r'^uploads/ti-posting-status/$', TIPostingStatusUploadView.as_view(),
            name='upload-ti-posting-status'),

        url(r'^uploads/lc-register/update$',
            LCRegisterUpdateView.as_view(), name='update-lc-register')
)

# reports and others
urlpatterns += patterns(
        '',

        url(
                r'^reports/old-cont-report/$',
                OldContingentBalancesViewRiskMgmt.as_view(),
                name='old-cont-report'),

        url(
                r'^contingent-non-post/$', ContingentNonPostView.as_view(),
                name='contingent-non-post'),

        url(
                r'^contingent-balances-risk/$',
                ContingentBalancesViewRiskMgmt.as_view(),
                name='contingent-balances-risk'),

        url(
                r'^reports/contingent-lc-bals/$', OutStandingLCBalances.as_view(),
                name='contingent-lc-bals'),
)
