from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required
from unmatched.views.uploads import ClirecUploadDisplayView, ClirecReconsActionView

from unmatched.views.clarec.api import (
    UnmatchedClirecListCreateAPIView,
    UnmatchedClirecUpdateAPIView)

urlpatterns = patterns(
    '',

    url('^upload-display-clirec/$',
        login_required(ClirecUploadDisplayView.as_view()),
        name='unmatched-upload'),

    url('^clirec-recons-actions/(?P<form_name>.+)/?$',
        ClirecReconsActionView.as_view(), name='clirec-recons-actions')
)

# API Clirec
urlpatterns += patterns(
    "",

    url(r'^unmatched-clirecs/?$',
        UnmatchedClirecListCreateAPIView.as_view(),
        name='unmatched-clarecs'),

    url(r'^unmatched-clirecs/(?P<pk>\d+)/?$',
        UnmatchedClirecUpdateAPIView.as_view(),
        name='unmatched-clarec'),
)
