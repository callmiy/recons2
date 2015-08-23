from django import forms
from ajax_select import make_ajax_form, make_ajax_field
from lcavail.models import LcAvailed, LCCoverMovement

lcavail_form = make_ajax_form(
    LcAvailed,
    {'memo_acct': 'ledger_memo_cash',
     'nostro_acct': 'nostro_acct'}
)


class LcAvailedAjaxForm(forms.ModelForm):
    class Meta:
        model = LcAvailed
        exclude = ('avail_date', 'date_processed',)

    nostro_acct = make_ajax_field(LcAvailed, 'nostro_acct', 'nostro_acct', help_text=None)

    memo_acct = make_ajax_field(LcAvailed, 'memo_acct', 'ledger_memo_cash', help_text=None)

    drawn_amt_text = forms.CharField(
        label='Amount Drawn',
        required=False,
        widget=forms.TextInput(
            attrs={'readonly': 'true'}
        )
    )

    drawn_amt = forms.CharField(
        widget=forms.NumberInput(
            attrs={'type': 'hidden'}))

    lc_avail_clirec_detail = forms.CharField(
        label='Clirec Detail',
        widget=forms.Textarea(
            attrs={'readonly': 'true', 'style': 'display: none;'}))

    clirec_id = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'type': 'hidden'}))


class LCCoverMovementForm(forms.ModelForm):

    class Meta:
        model = LCCoverMovement
        exclude = ('date_entry_passed',)

    class Media:
        css = {
            'all': ('lcavail/css/lc-cv-mvmt-create.css',)
        }

        js = ('lcavail/js/lc-cv-mvmt-create.js',)

    acct = make_ajax_field(
        LCCoverMovement, 'acct', 'nostro_acct', help_text=None)

    memo_acct = make_ajax_field(
        LCCoverMovement, 'memo_acct', 'ledger_memo_cash', help_text=None)

    amount_text = forms.CharField(
        label='Amount For Movement',
        required=False,
        widget=forms.TextInput(
            attrs={'class': 'form-control'}))
    swift_text = forms.CharField(required=False)
    amount = forms.CharField(widget=forms.NumberInput(attrs={'type': 'hidden'}))
    clirec_id = forms.CharField(
        required=False, widget=forms.TextInput(attrs={'type': 'hidden'}))
    lc_cvmvmt_clirec_detail = forms.CharField(
        label='Clirec Detail',
        widget=forms.Textarea(attrs={'readonly': 'true', 'style': 'display: none;'}))
