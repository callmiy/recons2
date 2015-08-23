from django.conf.urls import (patterns, url)
from core_recons.views import UpdateModelDate
from lcavail.models import LcAvailed
from lcavail.views.api import LCCoverMovementViewSet


# LcAvailed
urlpatterns = patterns(
    '',

    url(
        r'^update-date/avail-date/?',
        UpdateModelDate.as_view(
            model=LcAvailed,
            admin_redirect_url="/admin/lcavail/lcavailed/",
            model_date_field="avail_date",
            form_action_url_name='update_avail_date',
            label='Enter date Availed:',
            admin_href_text="Back to LC Availment Admin",
            headers=('LC Number', 'CCY', 'AMOUNT', 'BANK',
                     'ACCOUNT', 'DATE PROCESSED',),
            title='Update Date LC Availed',

            attributes=(
                'lc_number',
                'currency',
                'drawing',
                'swift_bic',
                'acct_numb',
                'date_processed',
            )

        ),
        name='update_avail_date'
    ),
)

# LCCoverMovement
urlpatterns += patterns(
    '',

    url(
        r'lc-cv-mvmts/$',
        LCCoverMovementViewSet.as_view({
            'get': 'list',
            'post': 'create'}),
        name='lc-cv-mvmt-list',
    ),

    url(
        r'lc-cv-mvmt/(?P<pk>\d+)/$',
        LCCoverMovementViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'}),
        name='lc-cv-mvmt-detail',
    ),

    url(
        r'lc-cv-mvmt-create/$',
        LCCoverMovementViewSet.as_view(
            {'get': 'render_template', 'post': 'post_cover'}
        ),
        name='lc-cv-mvmt-create',
    )
)
