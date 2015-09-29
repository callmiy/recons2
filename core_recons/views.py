from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic import View
from django.core.urlresolvers import reverse
from datetime import date
import json
import re


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
            'letterOfCreditAPIUrl': reverse('letterofcredit-list'),
            'letterOfCredit1APIUrl': reverse('lcregister-list'),
            'letterOfCreditStatusesAPIUrl': reverse('lcstatus-list'),
        })


date_re = re.compile("^(?P<day>\d{1,2})[-/:](?P<mon>\d{1,2})[-/:](?P<yr>\d{4})$")


class UpdateModelDate(View):
    # the admin page of the model whose field is being updated
    admin_redirect_url = None

    # the model whose field is being update
    model = None

    # the name of the date field on the model that is being updated
    model_date_field = ''

    # the url where the form of this page will be posted
    form_action_url_name = None

    # label of input field where user types new date
    label = None

    # the text of the link used to redirect from page back to model admin page
    admin_href_text = None

    # headers of table for displaying page attributes
    headers = None

    # attributes of model instances that will be displayed in table on the page
    attributes = None

    # title of the page
    title = None

    # method model class provides for updating the model date
    date_update_method_name = ''

    def get(self, request, *args, **kwargs):
        _ids = request.GET["ids"]
        return self.render_and_respond(request, self.context_objs(_ids), _ids)

    def post(self, request, *args, **kwargs):
        _ids = request.POST['id-vals']
        objs = self.context_objs(_ids)

        input_date = request.POST.get('date_update', '')
        if input_date == '00-00-0000':
            valid_date = 'None'
        else:
            date_matched = date_re.match(input_date.strip(' '))
            if date_matched:
                valid_date = """date(
                    int(date_matched.group('yr')),
                    int(date_matched.group('mon')),
                    int(date_matched.group('day')))"""
            else:
                return self.render_and_respond(
                    request, objs, _ids,
                    "Wrong date: %s" % (input_date or "No Date!!!"))

        if self.date_update_method_name != '':
            getattr(self.model, self.date_update_method_name)(
                objs, eval(valid_date))
        elif self.model_date_field != '':
            eval('objs.update(%s=%s)' % (self.model_date_field, valid_date))

        return redirect(self.admin_redirect_url)

    def context_objs(self, _ids):
        return self.model.objects.filter(
            id__in=[int(_id) for _id in _ids.split(",")])

    def render_and_respond(self, request, objs, ids, error_msg=""):
        context_objs = [
            [getattr(obj, attr) for attr in self.attributes] for obj in objs]
        return render(
            request, "model-date-update.html",
            {
                "form_action_url": reverse(self.form_action_url_name),
                "id_vals": ids,
                "label": self.label,
                "error_msg": error_msg,
                "admin_redirect_url": self.admin_redirect_url,
                "admin_href_text": self.admin_href_text,
                "headers": self.headers,
                "context_objects": context_objs,
                "title": self.title
            }
        )
