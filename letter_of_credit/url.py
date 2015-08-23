from django.contrib.auth.decorators import login_required
from django.conf.urls import url, patterns
from letter_of_credit.views import LetterOfCreditListCreateAPIView, LetterOfCreditUpdateAPIView, \
    LCStatusListCreateAPIView, LCStatusUpdateAPIView
from .views import Home
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
