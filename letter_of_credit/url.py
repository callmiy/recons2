from django.contrib.auth.decorators import login_required
from django.conf.urls import url, patterns
from .views import (
    Home,
    LetterOfCreditListCreateAPIView,
    LetterOfCreditUpdateAPIView,
    LCStatusListCreateAPIView,
    LCStatusUpdateAPIView,
    LetterOfCreditRegisterListCreateAPIView,
    LetterOfCreditRegisterUpdateAPIView,
    FormMListCreateAPIView,
    FormMUpdateAPIView,
    FormMHomeView)
from .views.upload_lc_register import LCRegisterUploadView, ReleaseTelexView

urlpatterns = patterns(
    # <editor-fold description='home view and upload'>
    '',

    url(r'^home/?$', login_required(Home.as_view()), name='letter-of-credit'),

    url(r'release-telex-mt-700/$', ReleaseTelexView.as_view(), name='release-telex-mt-700'),

    url(r'^uploads/lc-register/$', LCRegisterUploadView.as_view(), name='upload_lc_register'),
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='letter of credit api'>
    '',

    url(r'^letter-of-credits/?$',
        LetterOfCreditListCreateAPIView.as_view(),
        name='letterofcredit-list'),

    url(r'^letter-of-credits/(?P<pk>\d+)/?$',
        LetterOfCreditUpdateAPIView.as_view(),
        name='letterofcredit-detail')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='letter of credit api'>
    '',

    url(r'^letter-of-credits1/?$',
        LetterOfCreditRegisterListCreateAPIView.as_view(),
        name='lcregister-list'),

    url(r'^letter-of-credits1/(?P<pk>\d+)/?$',
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

    url(r'^form-m/home/?$', FormMHomeView.as_view(), name='form-m')
    # </editor-fold>
)
