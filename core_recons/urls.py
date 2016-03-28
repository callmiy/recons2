from django.conf.urls import url, patterns
from django.contrib.auth.decorators import login_required

from core_recons.views.attachment import AttachmentListCreateAPIView, AttachmentRetrieveUpdateDestroyAPIView, \
    AttachmentFileListCreateAPIView, AttachmentFileRetrieveUpdateDestroyAPIView, attachment_file_download_view
from .views import (
    ContentTypeListCreateAPIView,
    ContentTypeRetrieveUpdateDestroyAPIView,
    CommentRetrieveUpdateDestroyAPIView,
    CommentListCreateAPIView,
    FxDealRetrieveUpdateDestroyAPIView,
    FxDealListCreateAPIView,
)

urlpatterns = patterns(
        '',

        url(r'^ct/?$', ContentTypeListCreateAPIView.as_view(), name='contenttype-list'),

        url(r'^ct/(?P<pk>\d+)/?$', ContentTypeRetrieveUpdateDestroyAPIView.as_view(),
            name='contenttype-detail'),
)

urlpatterns += patterns(
        '',

        url(r'^comment/?$', login_required(CommentListCreateAPIView.as_view()), name='comment-list'),

        url(r'^comment/(?P<pk>\d+)/?$', login_required(CommentRetrieveUpdateDestroyAPIView.as_view()),
            name='comment-detail'),
)

# fx deals
urlpatterns += patterns(
        '',

        url(r'^fx-deal/?$', login_required(FxDealListCreateAPIView.as_view()), name='fxdeal-list'),

        url(r'^fx-deal/(?P<pk>\d+)/?$', login_required(FxDealRetrieveUpdateDestroyAPIView.as_view()),
            name='fxdeal-detail'),
)

# attachment
urlpatterns += patterns(
        '',

        url(r'^attachment/?$', login_required(AttachmentListCreateAPIView.as_view()), name='attachment-list'),

        url(r'^attachment/(?P<pk>\d+)/?$', login_required(AttachmentRetrieveUpdateDestroyAPIView.as_view()),
            name='attachment-detail'),
)

# attachment file
urlpatterns += patterns(
        '',

        url(r'^attachment-file/?$', login_required(AttachmentFileListCreateAPIView.as_view()),
            name='attachmentfile-list'),

        url(r'^attachment-file/(?P<pk>\d+)/?$', AttachmentFileRetrieveUpdateDestroyAPIView.as_view(),
            name='attachmentfile-detail'),

        url(r'^download-attachment-file/(?P<pk>\d+)/?$', login_required(attachment_file_download_view),
            name='download-attachment-file'),
)
