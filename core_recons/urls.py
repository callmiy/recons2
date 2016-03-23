from django.conf.urls import url, patterns
from django.contrib.auth.decorators import login_required

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

        url(r'^comment/(?P<pk>\d+)/?$', CommentRetrieveUpdateDestroyAPIView.as_view(),
            name='comment-detail'),
)

# fx deals
urlpatterns += patterns(
        '',

        url(r'^fx-deal/?$', login_required(FxDealListCreateAPIView.as_view()), name='fxdeal-list'),

        url(r'^fx-deal/(?P<pk>\d+)/?$', FxDealRetrieveUpdateDestroyAPIView.as_view(),
            name='fxdeal-detail'),
)


# attachment
urlpatterns += patterns(
        '',

        url(r'^attachment/?$', login_required(FxDealListCreateAPIView.as_view()), name='attachment-list'),

        url(r'^attachment/(?P<pk>\d+)/?$', FxDealRetrieveUpdateDestroyAPIView.as_view(),
            name='attachment-detail'),
)
