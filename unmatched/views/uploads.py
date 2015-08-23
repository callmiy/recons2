from django.views.generic import View
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponse
import json
from unmatched.forms import ClirecUploadForm
from unmatched.models import UnmatchedClarec, get_model_name, TakenToMemo
from adhocmodels.models import get_default_memos, LedgerAccount, NostroAccount
from lcavail.forms import LcAvailedAjaxForm, LCCoverMovementForm
from chgs.forms import ChargeAjaxForm
from undrawnbal.forms import UndrawnBalForm
from postentry.forms import ManualPostingForm
from postentry.models import EntryContra, EntryCode, EntryGeneratingTransaction
from datetime import date
import logging

logger = logging.getLogger('recons_logger')


class ClirecUploadDisplayView(View):
    """This view class will serve the page that will be used as single page application.
    (This is my humble attempt at SPA). Look at the template context returned: it
    contains the urls that are needed by the SPA to make xhr requests.
    """

    def get(self, request):
        return render(
            request, 'unmatched/clirec-upload-display.html',
            {
                'clarec_form': ClirecUploadForm(),
                'default_memos': json.dumps(get_default_memos()),
                'clirec_util_urls': json.dumps({
                    'clirecUploadUrl': reverse('unmatched-clarecs'),
                    'clirecReconsActionUrl': reverse('clirec-recons-actions',
                                                     args=('XXXXXX',)
                                                     )
                })
            }
        )


###################### helper clases for ClarecFormsView ###################
class ClirecHelper(object):
    def __init__(self, request):
        self.request = request

    def bootstrap(self):
        "entry point"
        return getattr(self, self.request.method.lower())()

    def update_related_clirec_obj(self, obj, uploaded_comment=''):
        "Update the clirec object from which the charge was created."
        clirec_id = self.request.POST.get('clirec_id')
        if clirec_id:
            clirec_obj = UnmatchedClarec.objects.get(pk=clirec_id)
            clirec_obj.clirec_obj = obj
            if hasattr(obj, 'lc_number'):
                clirec_obj.lc_number = obj.lc_number
            comment = clirec_obj.comment or ''
            if uploaded_comment:
                comment += '\n\n%s' % uploaded_comment
            clirec_obj.comment = comment + '\n%s' % get_model_name(obj)
            clirec_obj.date_upload_processed = date.today()
            clirec_obj.save()

    def set_and_return_errors(self, errors):
        errors['form_errors'] = True
        return HttpResponse(json.dumps(errors))


class ClirecUbukDepo1Gbp26(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/ubuk-depo-1gbp-26.html',
            {'form': ManualPostingForm(),
             'contra_name': 'IN3104010 GBP',
             'contra_id': 105,
             },
        )

    def update_comment(self, comment):
        for clirec in self.clirecs:
            old_comment = clirec.comment

            if not old_comment:
                clirec.comment = comment
            else:
                clirec.comment = "%s\n\n========================\n\n%s" % (
                    comment, clirec.comment)
            clirec.save()

            logger.info(
                """Clirec comment "%s" changed via manual posting.
                Old comment: %s
                New comment: %s""",
                clirec.details, old_comment, clirec.comment)
        return comment

    def post(self):
        form = ManualPostingForm(self.request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            _ids = cd['clirec_ids'].split(',')
            self.clirecs = UnmatchedClarec.objects.filter(pk__in=_ids)

            entry_gen_trxn = EntryGeneratingTransaction.objects.get(
                short_name='ACCTTOACCTTRF')
            entry_code = EntryCode.objects.get(code='AAT')
            amount = float(cd['manual_post_amount'])
            post_data = []

            for amt, acct in ((-amount, cd['dr_acct'],), (amount, cd['cr_acct'],)):
                post_data.append({
                    'amount': amt,
                    'account': LedgerAccount.objects.get(pk=acct),
                    'entry_code': entry_code,
                    'entry_gen_trxn': entry_gen_trxn,
                    'narration': 'INTEREST ON NOSTRO A/C DEPOSITS',
                })
            if EntryContra.post_entry(*post_data):
                comment = self.update_comment(cd['posting_enum'])

                del cd['posting_enum']
                clirec_details = '\n'.join(
                    '%d\t%s' % (i + 1, c.details,) for i, c in enumerate(self.clirecs))

                logger.info(
                    'Manual Posting for clirec details:\n%s\n\nPost Data:\n%s\n\n',
                    clirec_details,
                    cd,
                )
                return HttpResponse(
                    json.dumps(
                        {'msg': 'Entries Posted',
                         'ids': _ids, 'comment': comment,
                         }),
                    content_type='application/json'
                )

        return self.set_and_return_errors(form.errors)


class TakeToMemoView(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/take-to-memo.html',
            {'form': ManualPostingForm()},
        )

    def post(self):
        form = ManualPostingForm(self.request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            _ids = cd['clirec_ids'].split(',')
            self.clirecs = UnmatchedClarec.objects.filter(pk__in=_ids)

            memo_acct = LedgerAccount.objects.get(pk=self.request.POST['contra-acct'])
            amount_taken = float(self.request.POST['amount-taken'])

            taken_to_memo = TakenToMemo.objects.create(
                date=date.today(),
                amount=amount_taken,
                acct=memo_acct,
                contra_acct=NostroAccount.objects.get(pk=self.request.POST['memo-acct']),
                # clirecs=self.clirecs,
            )
            taken_to_memo.clirecs.add(*[c for c in self.clirecs])

            entry_gen_trxn = EntryGeneratingTransaction.objects.get(
                short_name='ACCTTOACCTTRF')
            entry_code = EntryCode.objects.get(code='AAT')
            amount = float(cd['manual_post_amount'])
            post_data = []

            for amt, acct in ((-amount, cd['dr_acct'],), (amount, cd['cr_acct'],)):
                post_data.append({
                    'amount': amt,
                    'account': LedgerAccount.objects.get(pk=acct),
                    'entry_code': entry_code,
                    'entry_gen_trxn': entry_gen_trxn,
                    'narration': cd['manual_post_narration'],
                })
            if EntryContra.post_entry(*post_data):
                comment = self.update_comment(cd['posting_enum'])

                del cd['posting_enum']
                clirec_details = '\n'.join(
                    '%d\t%s' % (i + 1, c.details,) for i, c in enumerate(self.clirecs))

                logger.info(
                    'Clirec details:\n%s\n\nPost Data:\n%s\n\nTaken to memo\n\n\n',
                    clirec_details,
                    cd,
                )
                return HttpResponse(
                    json.dumps(
                        {'msg': '{:,.2f} taken to account {}'.format(amount_taken, memo_acct, ),
                         'ids': _ids, 'comment': comment,
                         }),
                    content_type='application/json'
                )

        return self.set_and_return_errors(form.errors)

    def update_comment(self, comment):
        for clirec in self.clirecs:
            old_comment = clirec.comment

            if not old_comment:
                clirec.comment = comment
            else:
                clirec.comment = "%s\n\n========================\n\n%s" % (
                    comment, clirec.comment)
            clirec.save()

            logger.info(
                """Clirec comment "%s" changed via "TakeToMemo".
                Old comment: %s
                New comment: %s""",
                clirec.details, old_comment, clirec.comment)
        return comment


class ClirecManualPostings(ClirecHelper):
    def update_comment(self, comment):
        for clirec in self.clirecs:
            old_comment = clirec.comment

            if not old_comment:
                clirec.comment = comment
            else:
                clirec.comment = "%s\n\n========================\n\n%s" % (
                    comment, clirec.comment)
            clirec.save()

            logger.info(
                """Clirec comment "%s" changed via manual posting.
                Old comment: %s
                New comment: %s""",
                clirec.details, old_comment, clirec.comment)
        return clirec.comment

    def post_entries(self, data):
        entry_gen_trxn = EntryGeneratingTransaction.objects.get(
            short_name='ACCTTOACCTTRF')
        entry_code = EntryCode.objects.get(code='AAT')
        amount = float(data['manual_post_amount'])
        post_data = []

        for amt, acct in ((-amount, data['dr_acct'],), (amount, data['cr_acct'],)):
            post_data.append({
                'amount': amt,
                'account': LedgerAccount.objects.get(pk=acct),
                'entry_code': entry_code,
                'entry_gen_trxn': entry_gen_trxn,
                'narration': data['manual_post_narration'],
            })
        if EntryContra.post_entry(*post_data):
            del data['posting_enum']
            clirec_details = '\n'.join(
                '%d\t%s' % (i + 1, c.details,) for i, c in enumerate(self.clirecs))

            logger.info(
                'Manual Posting for clirec details:\n%s\n\nPost Data:\n%s\n\n',
                clirec_details,
                data,
            )
            return True
        return False

    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/manual-postings.html',
            {'form': ManualPostingForm()})

    def post(self):
        form = ManualPostingForm(self.request.POST)
        if form.is_valid():
            comment = ''
            msg = ''
            cd = form.cleaned_data
            _ids = cd['clirec_ids'].split(',')
            self.clirecs = UnmatchedClarec.objects.filter(pk__in=_ids)

            if cd['update_manual_post_comment']:
                if self.update_comment(cd['posting_enum']):
                    msg += 'comments successfully updated.'
                    comment = cd['posting_enum']

            if cd['create_manual_post']:
                if self.post_entries(cd):
                    msg += '\nEntries successfully posted.'

            return HttpResponse(
                json.dumps(
                    {'msg': msg, 'ids': _ids, 'comment': comment, }),
                content_type='application/json'
            )
        return self.set_and_return_errors(form.errors)


class ClirecLCUndrawnBal(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/lcundrawnbalance.html',
            {'form': UndrawnBalForm()})

    def post(self):
        form = UndrawnBalForm(self.request.POST)
        if form.is_valid():
            undrawn = form.save()
            self.update_related_clirec_obj(undrawn)

            return HttpResponse(
                json.dumps(
                    {'ref': undrawn.lc_number,
                     'msg': 'Undrawn Balance created for LC %s.' % undrawn.lc_number
                     }),
                content_type='application/json')
        return self.set_and_return_errors(form.errors)


class ClirecLCCoverMovement(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/lccovermovement.html',
            {'form': LCCoverMovementForm()})

    def post(self):
        form = LCCoverMovementForm(self.request.POST)
        if form.is_valid():
            cover = form.save()
            cover.post()
            self.update_related_clirec_obj(
                cover, self.request.POST.get('lc_cvmvmt_clirec_detail'))

            return HttpResponse(
                json.dumps(
                    {'ref': cover.lc_number,
                     'msg': 'LC Cover Movement entries passed for %s.' % cover.lc_number
                     }),
                content_type='application/json')

        return self.set_and_return_errors(form.errors)


class ClirecCharge(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/charge.html',
            {'form': ChargeAjaxForm()})

    def post(self):
        form = ChargeAjaxForm(self.request.POST)
        if form.is_valid():
            chg = form.save()
            self.update_related_clirec_obj(chg)

            return HttpResponse(
                json.dumps(
                    {'ref': chg.lc_number,
                     'msg': 'Charge for %s created.' % chg.lc_number}))

        return self.set_and_return_errors(form.errors)


class ClirecLCAvail(ClirecHelper):
    def get(self):
        return render(
            self.request,
            'unmatched/forms/clirec/availment.html',
            {'form': LcAvailedAjaxForm()}
        )

    def post(self):
        form = LcAvailedAjaxForm(self.request.POST)
        if form.is_valid():
            lc = form.save()
            lc.avail()
            self.update_related_clirec_obj(
                lc, self.request.POST.get('lc_avail_clirec_detail'))

            return HttpResponse(
                json.dumps(
                    {'msg': '%s availed.' % lc.lc_number,
                     'ref': lc.lc_number
                     }))
        return self.set_and_return_errors(form.errors)


class ClirecReconsActionView(View):
    """"This class will have helper classes which will do the work.

    A helper class must implement a bootstrap instance method which will be the entry point
    to the class.
    Typically, a helper class 'get' method will return a template containing a form
    while its 'post' method will process the form and respond with a json object of the form:
    {'msg': 'msg to send to client', 'ref': 'lc_number field of the clirec object'}

    register helpers in the dict below
    The key of this map (below) corresponds to an action which the client wishes
    to perform. The client will make an xhr request to url_name = 'clirec-recons-actions'
    (check .url.py module) and the action (key) will be captured by this class' render_response
    method as 'form_name'.
    """

    helpers = {
        'availment': ClirecLCAvail,
        'charge': ClirecCharge,
        'lccovermovement': ClirecLCCoverMovement,
        'lcundrawnbalance': ClirecLCUndrawnBal,
        'manual-postings': ClirecManualPostings,
        'ubuk-depo-1gbp-26': ClirecUbukDepo1Gbp26,
        'take-to-memo': TakeToMemoView,
    }

    def render_response(self, request, form_name):
        helper = self.helpers[form_name]
        assert hasattr(helper, 'bootstrap'), \
            'helper class must have a bootstrap instance method'
        return helper(request).bootstrap()

    def get(self, request, form_name):
        return self.render_response(request, form_name)

    def post(self, request, form_name):
        return self.render_response(request, form_name)
