from django.conf.urls import url, patterns
from .views import (
    RequestRefundView,
    UndrawnBalAPIListView,
    UndrawnBalAPIUpdateView
)


urlpatterns = patterns(
    '',
    url(r'^request-refund/$', RequestRefundView.as_view(),
        name='request-refund')
)

# API
urlpatterns += patterns(
    '',

    url(r'undrawn-balances/?$', UndrawnBalAPIListView.as_view(),
        name='undrawn-balances'),

    url(r'undrawn-balance/(?P<pk>\d+)/?$', UndrawnBalAPIUpdateView.as_view(),
        name='undrawn-balance-single'),
)
