from django.conf.urls import url, patterns
from rest_framework.generics import UpdateAPIView
from .views import (
    NostroAccountViewSet,
    LedgerAccountViewSet,
    CustomerUpdateAPIView,
    CustomerListCreateAPIView,
    CurrencyListCreateViewSet,
    RelationshipManagerListCreateAPIView, RelationshipManagerUpdateAPIView, BranchListCreateAPIView,
    BranchUpdateAPIView)

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

# customer API
urlpatterns += patterns(
    # <editor-fold description='customer api'>
    '',

    url(r'^customers/?$', CustomerListCreateAPIView.as_view(), name='customer-list'),

    url(r'^customers/(?P<pk>\d+)/?$', CustomerUpdateAPIView.as_view(), name='customer-detail')
    # </editor-fold>
)

# Branch API
urlpatterns += patterns(
    # <editor-fold description='customer api'>
    '',

    url(r'^branches/?$', BranchListCreateAPIView.as_view(), name='branch-list'),

    url(r'^branches/(?P<pk>\d+)/?$', BranchUpdateAPIView.as_view(), name='branch-detail')
    # </editor-fold>
)

# RelationshipManager API
urlpatterns += patterns(
    # <editor-fold description='customer api'>
    '',

    url(r'^relationship-managers/?$', RelationshipManagerListCreateAPIView.as_view(), name='relationshipmanager-list'),

    url(
        r'^relationship-managers/(?P<pk>\d+)/?$',
        RelationshipManagerUpdateAPIView.as_view(),
        name='relationshipmanager-detail')
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
    # </editor-fold>
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
    # </editor-fold>
)
