from django.conf.urls import url, patterns
from contingent_report.views.uploads import LCRegisterUpdateView
from .views import (UploadContingentReportView,
                    TIPostingStatusUploadView,
                    LCRegisterUploadView,
                    TIFlexDatePromptView,
                    ContingentNonPostView,
                    OldContingentBalancesViewRiskMgmt,
                    ContingentBalancesViewRiskMgmt,
                    OutStandingLCBalances,
                    UploadIncomeView, )
from contingent_report.views.contingent_postings import PostContingentView
from contingent_report.views.income_analysis import Income2View

# uploads
urlpatterns = patterns(
        '',
        url(r'^uploads/contingent/(?P<acct_status>.+/)?$',
            UploadContingentReportView.as_view(),
            name='upload-contingent'),

        url(r'^uploads/contingent2/$',
            TIFlexDatePromptView.as_view(),
            name='upload-contingent2'),

        url(r'^uploads/ti-posting-status/$', TIPostingStatusUploadView.as_view(),
            name='upload_ti_posting_status'),

        url(r'^uploads/lc-register/$',
            LCRegisterUploadView.as_view(), name='upload_lc_register'),

        url(r'^uploads/lc-register/update$',
            LCRegisterUpdateView.as_view(), name='update_lc_register')
)

# incomes
urlpatterns += patterns(
        '',

        url(r'^incomes/income1/$',
            UploadIncomeView.as_view(), name='upload-income'),

        url(r'^incomes/income2/$',
            Income2View.as_view(), name='income2'),
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

# Postings
urlpatterns += patterns(
        "",
        url(r"^adhoc-contingent-posting/$", PostContingentView.as_view(),
            name="adhoc-contingent-posting")
)
