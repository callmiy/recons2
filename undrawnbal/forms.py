from django import forms
from ajax_select import make_ajax_field
from .models import UndrawnBal, SourceFx


class UndrawnBalForm(forms.ModelForm):

    class Meta:
        model = UndrawnBal
        fields = ('estb_amt_ccy',)

    estb_amt_ccy = forms.CharField(required=False)
    claim_amt_ccy = forms.CharField(required=False)
    surplus_amt_ccy = forms.CharField(required=False)
    source_fund = forms.ChoiceField(required=False)

    estb_amt_text = forms.CharField(
        required=False,
        label='Estab. Amount',
        widget=forms.TextInput(
            attrs={'class': 'form-control'}
        ))
    estb_amt = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'hidden'})
    )
    claim_amt_text = forms.CharField(
        required=False,
        label='Claimed Amount',
        widget=forms.TextInput(
            attrs={'class': 'form-control'}
        ))
    claim_amt = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'hidden'})
    )
    surplus_amt_text = forms.CharField(
        required=False,
        label='Surplus Amount',
        widget=forms.TextInput(
            attrs={'class': 'form-control'}
        ))
    surplus_amt = forms.CharField(
        widget=forms.TextInput(attrs={'type': 'hidden'})
    )
    customer = make_ajax_field(
        UndrawnBal,
        'customer',
        'customer',
        help_text=None,)
    nostro = make_ajax_field(
        UndrawnBal,
        'nostro',
        'nostro_acct',
        help_text=None,
    )
    clirec_id = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'type': 'hidden'}))

    def clean(self):
        cleaned_data = super(UndrawnBalForm, self).clean()
        nostro = cleaned_data['nostro']
        ccy = nostro.ccy

        if not cleaned_data.get('estb_amt_ccy'):
            cleaned_data['estb_amt_ccy'] = ccy
        if not cleaned_data.get('claim_amt_ccy'):
            cleaned_data['claim_amt_ccy'] = ccy
        if not cleaned_data.get('surplus_amt_ccy'):
            cleaned_data['surplus_amt_ccy'] = ccy

        if not cleaned_data.get('source_fund'):
            cleaned_data['source_fund'] = SourceFx.objects.get(code='AUTO')

        return cleaned_data
