from django import forms
from ajax_select.fields import AutoCompleteSelectField
from postentry.models import EntryGeneratingTransaction


TRXN_TYPES = [('', '----------------------'),
              ('delete', 'Delete Selected Records')
              ]
TRXN_TYPES += [(e.description.lower().replace(' ', ''), e.description.title())
               for e in EntryGeneratingTransaction.objects.filter(
                   display=True)]
TRXN_TYPES += [('manual-postings', 'Manual Postings'),
               ('ubuk-depo-1gbp-26', 'UBUK DEPOSIT 1 GBP|GBP26'),
               ('take-to-memo', 'Take To Memo'),
               ]


class ClirecUploadForm(forms.Form):
    class Media:
        js = ('unmatched/js/clirec-upload-utilities.js',
              'unmatched/js/clirec-upload.js',
              'unmatched/js/clirec-template-utils.js',)

    details = forms.CharField(
        widget=forms.Textarea(
            attrs={'id': 'clarec-upload-data-text', 'rows': 20, 'disabled': 'true'}
        ))

    clirec_nostro = AutoCompleteSelectField(
        'nostro_acct',
        label='Nostro',
        help_text=None,
        widget=forms.Select(
            attrs={'class': 'form-control'}
        )
    )

    recons_actions = forms.ChoiceField(
        label='Recons Actions',
        choices=TRXN_TYPES,
        widget=forms.Select(
            attrs={'class': 'form-control', 'disabled': 'true'}
        )
    )
