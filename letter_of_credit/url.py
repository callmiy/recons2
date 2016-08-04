from django.contrib.auth.decorators import login_required
from django.conf.urls import url, patterns
from .views import (
    LCStatusListCreateAPIView,
    LCStatusUpdateAPIView,
    LetterOfCreditRegisterListCreateAPIView,
    LetterOfCreditRegisterUpdateAPIView,
    FormMListCreateAPIView,
    FormMRetrieveUpdateDestroyAPIView,
    AppHomeView,
    LCRegisterUploadView,
    ReleaseTelexView,
    LCIssueUpdateAPIView,
    LCIssueListCreateAPIView,
    LCIssueConcreteListCreateAPIView,
    LCIssueConcreteUpdateAPIView,
    LcBidRequestListCreateAPIView,
    LcBidRequestUpdateAPIView,
    DownloadBidsView,
    UploadedFormMListCreateAPIView,
    UploadedFormMUpdateAPIView,
    FormMCoverListCreateAPIView,
    FormMCoverRetrieveUpdateDestroyAPIView,
    UploadFromSingleWindowView,
    ProcessSwiftView,
    UploadLcCommissionView,
    DownloadBidsLcEstablished,
    TreasuryAllocationListCreateAPIView,
    TreasuryAllocationRetrieveUpdateDestroyAPIView,
    ConsolidatedLcBidRequestUpdateAPIView,
    ConsolidatedLcBidRequestListCreateAPIView,
    DownloadConsolidatedBidsView, DownloadAllocationsView)

urlpatterns = patterns(
        # <editor-fold description='home view and upload'>
        '',

        url(r'release-telex-mt-700/$',
            login_required(ReleaseTelexView.as_view()),
            name='release-telex-mt-700'),

        url(r'^uploads/lc-register/$',
            login_required(LCRegisterUploadView.as_view()),
            name='upload_lc_register'),
        # </editor-fold>
)

urlpatterns += patterns(
        # <editor-fold description='letter of credit register api'>
        '',

        url(r'^letter-of-credits/?$',
            login_required(LetterOfCreditRegisterListCreateAPIView.as_view()),
            name='lcregister-list'),

        url(r'^letter-of-credits/(?P<pk>\d+)/?$',
            login_required(LetterOfCreditRegisterUpdateAPIView.as_view()),
            name='lcregister-detail')
        # </editor-fold>
)

urlpatterns += patterns(
        # <editor-fold description='letter of credit status api'>
        '',

        url(r'^lc-statuses/?$',
            login_required(LCStatusListCreateAPIView.as_view()),
            name='lcstatus-list'),

        url(r'^lc-statuses/(?P<pk>\d+)/?$',
            login_required(LCStatusUpdateAPIView.as_view()),
            name='lcstatus-detail')
        # </editor-fold>
)

urlpatterns += patterns(
        # <editor-fold description='form M'>
        '',

        url(r'^form-m/?$', login_required(FormMListCreateAPIView.as_view()), name='formm-list'),

        url(r'^form-m/(?P<pk>\d+)/?$', login_required(FormMRetrieveUpdateDestroyAPIView.as_view()),
            name='formm-detail'),

        url(r'^app/home/?$', login_required(AppHomeView.as_view()), name='lc-app-home')
        # </editor-fold>
)

urlpatterns += patterns(
        # <editor-fold description='form M Cover'>
        '',

        url(r'^form-m-cover/?$',
            login_required(FormMCoverListCreateAPIView.as_view()),
            name='formmcover-list'),

        url(r'^form-m-cover/(?P<pk>\d+)/?$', login_required(FormMCoverRetrieveUpdateDestroyAPIView.as_view()),
            name='formmcover-detail'),
        # </editor-fold>
)

urlpatterns += patterns(
        # <editor-fold description='LC Issue'>
        '',

        url(r'^lc-issue/?$', login_required(LCIssueListCreateAPIView.as_view()), name='lcissue-list'),

        url(r'^lc-issue/(?P<pk>\d+)/?$', login_required(LCIssueUpdateAPIView.as_view()), name='lcissue-detail'),
        # </editor-fold>
)

# lc issue concrete
urlpatterns += patterns(
        '',

        url(r'^lc-issue-concrete/?$', login_required(LCIssueConcreteListCreateAPIView.as_view()),
            name='lcissueconcrete-list'),

        url(r'^lc-issue-concrete/(?P<pk>\d+)/?$', login_required(LCIssueConcreteUpdateAPIView.as_view()),
            name='lcissueconcrete-detail'),
)

# uploaded form
urlpatterns += patterns(
        '',

        url(r'^uploaded-form-m/?$', login_required(UploadedFormMListCreateAPIView.as_view()),
            name='uploadedformm-list'),

        url(r'^uploaded-form-m/(?P<pk>\d+)/?$', login_required(UploadedFormMUpdateAPIView.as_view()),
            name='uploadedformm-detail'),

        url(r'^upload-form-m-single-window/?$', login_required(UploadFromSingleWindowView.as_view()),
            name='sing-win-form-m-upload'),
)

# bid
urlpatterns += patterns(
        '',

        url(r'^lc-bid-request/?$', login_required(LcBidRequestListCreateAPIView.as_view()), name='lcbidrequest-list'),

        url(r'^lc-bid-request/(?P<pk>\d+)/?$', login_required(LcBidRequestUpdateAPIView.as_view()),
            name='lcbidrequest-detail'),

        url(r'^lc-bid-request/download/?$', login_required(DownloadBidsView.as_view()), name='lcbidrequest-download'),

        url(r'^lc-estb-bid-request/download/?$', login_required(DownloadBidsLcEstablished.as_view()),
            name='lc-estb-bid-download'),
)

# consolidated bid
urlpatterns += patterns(
        '',

        url(r'^consolidated-lc-bid-request/?$',
            login_required(ConsolidatedLcBidRequestListCreateAPIView.as_view()),
            name='consolidatedlcbidrequest-list'),

        url(r'^consolidated-lc-bid-request/(?P<pk>\d+)/?$',
            login_required(ConsolidatedLcBidRequestUpdateAPIView.as_view()),
            name='consolidatedlcbidrequest-detail'),

        url(r'^consolidated-lc-bid-request/download/?$', login_required(DownloadConsolidatedBidsView.as_view()),
            name='consolidated-lc-bid-request-download'),
)

# treasury allocation
urlpatterns += patterns(
        '',

        url(r'^treasury-allocation/?$', login_required(TreasuryAllocationListCreateAPIView.as_view()),
            name='treasuryallocation-list'),

        url(r'^treasury-allocation/(?P<pk>\d+)/?$',
            login_required(TreasuryAllocationRetrieveUpdateDestroyAPIView.as_view()),
            name='treasuryallocation-detail'),

        url(r'^download-treasury-allocations/?$', login_required(DownloadAllocationsView.as_view()),
            name='download-treasury-allocations'),
)

# process swift
urlpatterns += patterns(
        '',

        url(r'^process-swift/?$', login_required(ProcessSwiftView.as_view()), name='process-swift'),
)

# LC commission
urlpatterns += patterns(
        '',

        url(r'^upload-lc-commission/?$', login_required(UploadLcCommissionView.as_view()), name='upload-lc-commission'),
)
