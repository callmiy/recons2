from django.test import TestCase
from django.core.urlresolvers import reverse
from django.forms import Form


class RateUploadViewTest(TestCase):

    def test_view_uses_correct_template(self):
        response = self.client.get(reverse('rate_home'))

        self.assertTemplateUsed(response, 'rateshome.html')

    def test_view_serves_form(self):
        response = self.client.get(reverse('rate_home'))

        self.assertTrue(response.context['form'] is not None)

    def test_view_serves_correct_form_instance(self):
        response = self.client.get(reverse('rate_home'))

        self.assertIsInstance(response.context['form'], Form)
