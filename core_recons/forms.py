from django import forms


class UploadForm(forms.Form):
    upload_text = forms.CharField(widget=forms.Textarea)
