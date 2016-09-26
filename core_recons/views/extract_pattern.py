from django.shortcuts import render
from django.views.generic import View
import re
import json


class ExtractPattern(View):
    EXTRACTORS = {
        'form-m': re.compile(r'(MF20\d+)', re.IGNORECASE),
        'letter-of-credit': re.compile(r'(ILCL[A-Z]{2,3}\d+(?:/\d+)?)', re.IGNORECASE),
        'form-m-lc': re.compile(r'((ILCL[A-Z]{2,3}\d+(?:/\d+)?)|(MF20\d+))', re.IGNORECASE),
    }

    def get(self, request, extracted=None, raw_text=''):
        return render(
                request,
                'core_recons/extract-pattern.html',
                {
                    'extracted': json.dumps(extracted),
                    'raw_text': raw_text
                }
        )

    def post(self, request):
        selected_pattern = request.POST.get('selected-pattern')
        text = request.POST.get('raw-text').strip()

        if selected_pattern and text:
            pattern_re = self.EXTRACTORS.get(selected_pattern)

            if pattern_re:
                return self.get(
                        request, {
                            'result': self.extract(pattern_re, text)
                        },
                        text
                )

        return self.get(
                request,
                {
                    'error': 'No text or pattern'
                }
        )

    def extract(self, pattern_re, text):
        result = []
        for line in text.split('\n'):
            line = line.strip().replace('"', '').replace('\t', '')
            searched = pattern_re.search(line)
            val = 'No match'

            if searched:
                val = searched.group(1)
            result.append(val)

        return result
