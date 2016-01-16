from django.views.generic import View
from django.core.urlresolvers import reverse
import json
from letter_of_credit.models import FormMCover
from .update_model_date import UpdateModelDate
from .content_type import ContentTypeListCreateAPIView, ContentTypeRetrieveUpdateDestroyAPIView
from .comment import CommentListCreateAPIView, CommentRetrieveUpdateDestroyAPIView
from .fx_deal import FxDealListCreateAPIView, FxDealRetrieveUpdateDestroyAPIView


class CoreAppsView(View):
    @staticmethod
    def get_core_app_urls():
        return json.dumps({
            'customerAPIUrl': reverse('customer-list'),
            'branchAPIUrl': reverse('branch-list'),
            'currencyAPIUrl': reverse('currency-list'),
            'lcBidRequestAPIUrl': reverse('lcbidrequest-list'),
            'lcBidRequestDownloadUrl': reverse('lcbidrequest-download'),
            'lcIssueAPIUrl': reverse('lcissue-list'),
            'lcIssueConcreteAPIUrl': reverse('lcissueconcrete-list'),
            'formMAPIUrl': reverse('formm-list'),
            'uploadedFormMAPIUrl': reverse('uploadedformm-list'),
            'letterOfCreditAPIUrl': reverse('lcregister-list'),
            'letterOfCreditStatusesAPIUrl': reverse('lcstatus-list'),
            'formMCoverAPIUrl': reverse('formmcover-list'),
            'commentAPIUrl': reverse('comment-list'),
            'fxDealAPIUrl': reverse('fxdeal-list'),
        })

    @staticmethod
    def get_form_m_cover_types():
        return {'form_m_cover_types': json.dumps(FormMCover.COVER_TYPES)}
