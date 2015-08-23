from django import forms

format1_label = """
Copy and paste rate in format 1 style as
below:

158.75
161.75
EURO (EUR1/USD)
1.3528
POUND STERLING (GBP1/USD)
1.5965
SWISS FRANC (USD1/CHF)
0.9132
JAPANESE YEN (USD1/JPY)
97.84
CHINESE YUAN (USD1/CNY)
6.1207
CANADIAN DOLLAR (USD1/CAD)
1.0419
AUSTRALIAN DOLLAR (USD1/AUD)
0.9470
SOUTH AFRICAN RAND (USD1/ZAR)
9.9950
""".strip(r'\s\n\r\t')


class RateUploadForm(forms.Form):
    format1 = forms.CharField(
        widget=forms.Textarea,
        required=True,
        label=format1_label,
        help_text=format1_label)

    format2 = forms.CharField(
        widget=forms.Textarea,
        required=False,
        label='Format 2')
