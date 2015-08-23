from django import forms
from ajax_select import make_ajax_field
from .models import Charge


class ChargeAjaxForm(forms.ModelForm):

    class Meta:
        model = Charge
        exclude = (
            'val_date_adv', 'tkt_req_date', 'tkt_mvd_date')

    customer = make_ajax_field(Charge, 'customer', 'customer', help_text=None)
    cr_acct = make_ajax_field(Charge, 'cr_acct', 'nostro_acct', help_text=None)
    ccy = forms.CharField(required=False)
    req_bank = forms.CharField(required=False)
    clirec_id = forms.CharField(widget=forms.TextInput(attrs={'type': 'hidden'}))
    amount_text = forms.CharField(
        label='Charge Amount', required=False,
        widget=forms.TextInput(attrs={'class': 'form-control'}))
    amount = forms.CharField(widget=forms.NumberInput(attrs={'type': 'hidden'}))
    clirec_details = forms.CharField(
        label='Clirec Detail',
        widget=forms.Textarea(
            attrs={
                'readonly': 'true',
                'cols': 55,
                'rows': 3,
                'class':
                'form-control'}))
    swift_txt = forms.CharField(
        label='SWIFT Text',
        required=False,
        widget=forms.Textarea(
            attrs={
                'cols': 55,
                'rows': 4,
                'class': 'form-control'}))

    def clean(self):
        cleaned_data = super(ChargeAjaxForm, self).clean()
        cr_acct = cleaned_data['cr_acct']
        if not cleaned_data.get('ccy'):
            cleaned_data['ccy'] = cr_acct.ccy

        if not cleaned_data.get('req_bank'):
            cleaned_data['req_bank'] = cr_acct.bank

        return cleaned_data
