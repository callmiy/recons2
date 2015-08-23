from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from .forms import RateUploadForm
from xlwt import Workbook
import re


class RateView(View):
    def get(self, request):
        return render(request, 'rateupload/rateshome.html', {'form': RateUploadForm()})

    def post(self, request):
        form = RateUploadForm(request.POST)
        if form.is_valid():
            rates = self.process_rates_fmt1(form.cleaned_data['format1'])
            if request.POST.get('get-rate-btn'):
                return render(
                    request, 'rateupload/rateshome.html', {'form': form, 'rates': rates})
            else:
                return self.download_xl(rates)

        else:
            return render(request, 'rateupload/rateshome.html', {'form': form})

    def validate_fmt1(self, ratelist):
        NUMBER_RE = re.compile('^[0-9]+(?:\.[0-9]+)?$')
        CCY_RE = re.compile("\((?P<num>[A-Z]{3})1/(?P<den>[A-Z]{3})\)$")
        matches = [NUMBER_RE.search(el) for el in ratelist[:2]]
        for index, el in enumerate(ratelist[2:]):
            matches.append(
                (index % 2 == 0) and CCY_RE.search(el) or NUMBER_RE.search(el))
        return all(matches)

    def process_rates_fmt1(self, data):
        CCY_RE = re.compile("\((?P<num>[A-Z]{3})1/(?P<den>[A-Z]{3})\)$")
        rates = {}
        data = [el.strip('\n\r ') for el in data.split('\n')]

        self.validate_fmt1(data)

        rates['NGN'] = sum((float(data[0]), float(data[1]))) / 2

        for index in range(2, len(data), 2):
            val1 = data[index]
            val2 = data[index+1]

            xchg = CCY_RE.search(val1)
            if xchg.group('num') == 'USD':
                rates[xchg.group('den')] = round(1/float(val2), 7)
            else:
                rates[xchg.group('num')] = round(float(val2), 7)

        return rates

    def download_xl(self, rates):
        wbk = Workbook()
        wsh = wbk.add_sheet('RATES')
        row = 0

        for ccy, xchg_rate in rates.items():
            wsh.write(row, 0, ccy)
            wsh.write(row, 1, xchg_rate)
            row += 1

        response = HttpResponse(content_type='application/xls')
        response['Content-Disposition'] = 'attachment; filename="rates.xls"'
        wbk.save(response)
        return response
