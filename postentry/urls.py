from django.conf.urls import patterns, url
from .views import PostingView
from core_recons.views import UpdateModelDate
from .models import EntryContra

urlpatterns = patterns(
    '',

    url('^process-postings/$', PostingView.as_view(),
        name='process-for-posting'),

    url(
        r'^update-post-date/?',
        UpdateModelDate.as_view(
            model=EntryContra,
            admin_redirect_url='/admin/%s' % str(
                EntryContra._meta).replace('.', '/'),
            model_date_field='date_posted',
            form_action_url_name='update-post-date',
            label='Enter Posting Date',
            admin_href_text='Return to Entries',
            title='Update Posting Date',

            headers=(
                'Account Number', 'Amount', 'DR/CR', 'ENTRY CODE', 'NARRATION',
                'REFERENCE', 'TIME CREATED',),

            attributes=(
                'account', 'amt_fmt', 'dr_cr', 'entry_code', 'narration', 'ref',
                'time_created',
            ),
        ),
        name='update-post-date',
    ),

    url(r'^update-post-status/$', 'postentry.views.ajax_update_post_status',
        name='update-post-status')
)
