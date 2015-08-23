# from django.conf import settings
# settings.configure()

from rest_framework.test import APITestCase
import mock
from unmatched.views.uploads import ClirecLCAvail, ClirecManualPostings
from unmatched.models import get_model_name
from model_mommy import mommy
import nose.tools as nt


class ClirecLCAvailTest(APITestCase):
    # @nt.nottest
    def test_get_model_name(self):
        """test function get_model_name"""
        lc = mommy.prepare_recipe('lcavail.lcavailed')

        # switch off lc number validation
        # (check lcavail.models.LcAvailed.lc_availed_pre_save)
        lc.dont_validate = {
            'lc_number': True,
        }
        lc.save()

        nt.eq_(
            'LcAvailed: %s' % lc.__unicode__(),
            get_model_name(lc)
        )

    @nt.nottest
    @mock.patch('unmatched.views.uploads.ClirecLCAvail.get')
    def test_class_bootstrap_calls_instance_method_get_for_a_get_request(
            self, mocked_get):
        """Test calling the class with a request.GET method.

        This should call an instance method of the same lowercased name"""

        request = mock.Mock(method='GET')
        c = ClirecLCAvail(request=request)
        c.bootstrap()
        mocked_get.assert_called_once_with()

    @nt.nottest
    @mock.patch('unmatched.views.uploads.ClirecLCAvail.post')
    def test_class_bootstrap_calls_instance_method_post_for_a_post_request(
            self, mocked_post):
        """Test calling the class with a request.POST method.

        This should call an instance method of the same lowercased name"""

        request = mock.Mock(method='POST')
        c = ClirecLCAvail(request=request)
        c.bootstrap()
        mocked_post.assert_called_once_with()


class ClirecManualPostingsTest(APITestCase):

    def test_update_comment(self):
        self = mock.Mock(spec=ClirecManualPostings)
        clirec = mock.Mock(comment='comment1')
        self.clirecs = (clirec,)
        comment = ClirecManualPostings.update_comment(self, 'comment2')

        nt.eq_(
            comment,
            "%s\n\n========================\n\n%s" % ('comment2', 'comment1',)
        )
