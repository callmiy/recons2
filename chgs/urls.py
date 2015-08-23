from django.conf.urls import patterns, url
from core_recons.views import UpdateModelDate
from .views import PrintChgsView, UpdateDateView, DownloadChgs
from .models import Charge

CHG_ADMIN_URL = "/admin/%s/" % str(Charge._meta).replace('.', '/')

urlpatterns = patterns(
    # <editor-fold desc="">
    '',

    url(r'^print/(?P<reqtype>\w+)/$', PrintChgsView.as_view(),
        name='printchgs'),

    url(
        r'^update-tkt-mvd-date/$',
        UpdateModelDate.as_view(
            model=Charge,
            admin_redirect_url=CHG_ADMIN_URL,
            model_date_field='tkt_mvd_date',
            form_action_url_name='update_date_tkt_mvd',
            label='Enter Date Ticket Moved',
            admin_href_text='Return to Charges',
            title='Update Date Ticket Moved To Trops',

            headers=(
                'LC Number', 'Customer Name', 'Currency', 'Amount',
                'Date Processed', 'Date of Ticket Request From Dealers',),

            attributes=(
                'lc_number', 'customer', 'currency', 'amountformated',
                'date_processed', 'tkt_req_date',)
        ),
        name='update_date_tkt_mvd'
    ),

    url(
        r'^update-tkt-reqd-date/$',
        UpdateModelDate.as_view(
            model=Charge,
            admin_redirect_url=CHG_ADMIN_URL,
            model_date_field='tkt_req_date',
            form_action_url_name='update-tkt-reqd-date',
            label='Enter Date Ticket Requested',
            admin_href_text='Return to Charges',
            title='Update Date Ticket Request Sent To Dealers',

            headers=(
                'LC Number', 'Customer Name', 'Currency', 'Amount',
                'Date Processed',),

            attributes=(
                'lc_number', 'customer', 'currency', 'amountformated',
                'date_processed',)
        ),
        name='update-tkt-reqd-date'
    ),
    # </editor-fold>
)

urlpatterns += patterns(
    '',
    url(r'^update-chgs-dates/$', UpdateDateView.as_view(), name='update-chgs-dates'),
)

urlpatterns += patterns(
    '',
    url(r'^download-chgs/$', DownloadChgs.as_view(), name='download-chgs',),
)
