from django.conf.urls import url, patterns
from adhocmodels.views import CustomerListCreateViewSet, CurrencyListCreateViewSet
from .views import NostroAccountViewSet, LedgerAccountViewSet


urlpatterns = patterns(
    '',

    url(r'^get-default-memos/?$',
        'adhocmodels.views.get_default_memos_view',
        name='get-default-memos')
)

# nostro api
urlpatterns += patterns(
    # <editor-fold>
    '',

    url(r'^nostro-acct/?$',
        NostroAccountViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='nostroaccount-list'),

    url(r'^nostro-acct/(?P<pk>\d+)/$',
        NostroAccountViewSet.as_view({'get': 'retrieve',
                                      'put': 'update',
                                      'patch': 'partial_update'}),
        name='nostroaccount-detail')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='customer api'>
    '',

    url(r'^customers/?$', CustomerListCreateViewSet.as_view(), name='customer-list'),

    url(r'^customers/(?P<pk>\d+)/?$', CustomerListCreateViewSet.as_view(), name='customer-detail')
    # </editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='currency api'>
    '',

    url(r'^ccy/?$',
        CurrencyListCreateViewSet.as_view(),
        name='currency-list'),

    url(r'^ccy/(?P<pk>\d+)/?$',
        CurrencyListCreateViewSet.as_view(),
        name='currency-detail')
    #</editor-fold>
)

urlpatterns += patterns(
    # <editor-fold description='ledger account'>
    '',

    url(r'^ledger-acct/$',
        LedgerAccountViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='ledgeraccount-list'),

    url(r'^ledger-acct/(?P<pk>\d+)/$',
        LedgerAccountViewSet.as_view({'get': 'retrieve',
                                      'put': 'update',
                                      'patch': 'partial_update',
                                      'delete': 'destroy'}),
        name='ledgeraccount-detail')
    #</editor-fold>
)
