from django.conf.urls import (patterns, url)
from core_recons.views import UpdateModelDate
from ibdint.models import IbdInt
from .views import ITFReportView


urlpatterns = patterns(
    '',

    url(
        r'^update-date/pl/?',
        UpdateModelDate.as_view(
            model=IbdInt,
            admin_redirect_url="/admin/ibdint/ibdint/",
            model_date_field='valdate_in_pl',
            form_action_url_name='update_date_paid_into_pl',
            label='Enter Date Paid into P/L',
            admin_href_text='Return to IBD Int Admin',
            title='Update Date Interests Paid Into P/L',

            headers=(
                'LC Number',
                'Customer Name',
                'Currency',
                'Amount',
                'Date Processed',
                'Value Date In C/A',
            ),

            attributes=(
                'lc_number',
                'customer',
                'currency',
                'amount',
                'date_processed',
                'valdate_in_ca',
            )
        ),
        name='update_date_paid_into_pl'
    ),

    url(r'^itf-reports/$', ITFReportView.as_view(), name='itf_report')
)
