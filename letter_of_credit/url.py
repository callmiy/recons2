from django.contrib.auth.decorators import login_required
from django.conf.urls import url, patterns
from .views import (
    LCStatusListCreateAPIView,
    LCStatusUpdateAPIView,
    LetterOfCreditRegisterListCreateAPIView,
    LetterOfCreditRegisterUpdateAPIView,
    FormMListCreateAPIView,
    FormMUpdateAPIView,
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
    UploadedFormMUpdateAPIView
)

urlpatterns = patterns(
    # <editor-fold description='home view and upload'>
    '',

    url(r'release-telex-mt-700/$', ReleaseTelexView.as_view(), name='release-telex-mt-700'),

    url(r'^uploads/lc-register/$', LCRegisterUploadView.as_view(), name='upload_lc_register'),
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='letter of credit register api'>
    '',

    url(r'^letter-of-credits/?$',
        LetterOfCreditRegisterListCreateAPIView.as_view(),
        name='lcregister-list'),

    url(r'^letter-of-credits/(?P<pk>\d+)/?$',
        LetterOfCreditRegisterUpdateAPIView.as_view(),
        name='lcregister-detail')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='letter of credit status api'>
    '',

    url(r'^lc-statuses/?$',
        LCStatusListCreateAPIView.as_view(),
        name='lcstatus-list'),

    url(r'^lc-statuses/(?P<pk>\d+)/?$',
        LCStatusUpdateAPIView.as_view(),
        name='lcstatus-detail')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='form M'>
    '',

    url(r'^form-m/?$', FormMListCreateAPIView.as_view(), name='formm-list'),

    url(r'^form-m/(?P<pk>\d+)/?$', FormMUpdateAPIView.as_view(), name='formm-detail'),

    url(r'^app/home/?$', login_required(AppHomeView.as_view()), name='lc-app-home')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='LC Issue'>
    '',

    url(r'^lc-issue/?$', LCIssueListCreateAPIView.as_view(), name='lcissue-list'),

    url(r'^lc-issue/(?P<pk>\d+)/?$', LCIssueUpdateAPIView.as_view(), name='lcissue-detail'),
    # </editor-fold>
)

# lc issue concrete
urlpatterns += patterns(
    '',

    url(r'^lc-issue-concrete/?$', LCIssueConcreteListCreateAPIView.as_view(), name='lcissueconcrete-list'),

    url(r'^lc-issue-concrete/(?P<pk>\d+)/?$', LCIssueConcreteUpdateAPIView.as_view(), name='lcissueconcrete-detail'),
)

# uploaded form m
urlpatterns += patterns(
    '',

    url(r'^uploaded-form-m/?$', UploadedFormMListCreateAPIView.as_view(), name='uploadedformm-list'),

    url(r'^uploaded-form-m/(?P<pk>\d+)/?$', UploadedFormMUpdateAPIView.as_view(), name='uploadedformm-detail'),
)

# bid
urlpatterns += patterns(
    '',

    url(r'^lc-bid-request/?$', LcBidRequestListCreateAPIView.as_view(), name='lcbidrequest-list'),

    url(r'^lc-bid-request/(?P<pk>\d+)/?$', LcBidRequestUpdateAPIView.as_view(), name='lcbidrequest-detail'),

    url(r'^lc-bid-request/download/?$', DownloadBidsView.as_view(), name='lcbidrequest-download'),
)
