from django import forms
from ajax_select.fields import AutoCompleteSelectWidget


class ManualPostingForm(forms.Form):
    dr_acct = forms.CharField(
        label='Debit Account',
        widget=AutoCompleteSelectWidget(
            'ledger', help_text=None, attrs={'class': 'form-control'})
    )
    cr_acct = forms.CharField(
        label='Credit Account',
        widget=AutoCompleteSelectWidget(
            'ledger', help_text=None, attrs={'class': 'form-control'})
    )
    manual_post_amount = forms.CharField(
        widget=forms.NumberInput(attrs={'type': 'hidden'})
    )
    posting_enum = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'posting-enumeration form-control'})
    )
    clirec_ids = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'hidden'})
    )
    update_manual_post_comment = forms.BooleanField(
        required=False,
        label='Update Comment',
        widget=forms.CheckboxInput(attrs={'checked': 'true'}))
    create_manual_post = forms.BooleanField(required=False, label='Post Entries')
    manual_post_narration = forms.CharField(
        label='Narration',
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control manual-post-rqd'}))
    manual_post_batch_no = forms.CharField(
        label='Batch No.',
        required=False,
        max_length=4,
        min_length=4,
        widget=forms.TextInput(attrs={'class': 'form-control manual-post-rqd'}))
