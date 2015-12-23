from django.views.generic import View
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from letter_of_credit.models import LCRegister
from datetime import date
import calendar

import logging
log = logging.getLogger('recons_logger')

__all__ = ('LCDownloadView', 'LCVolumAnalysisView')

MONTHS_NAMES_INDEX = dict(
    [(calendar.month_name[index], index) for index in range(1, 13)])


def get_display_yr_month():
    TODAY = date.today()
    THIS_YEAR = TODAY.year
    THIS_MONTH = TODAY.month
    THIS_YEAR_MONTHS = [(
        THIS_YEAR, calendar.month_name[i],) for i in range(THIS_MONTH, 0, -1)]

    BASE_YEAR = 2013   # year TI went live
    MONTH_IN_BASE_YEAR = 5  # TI went live May 2013
    BASE_YEAR_MONTHS = [(BASE_YEAR, calendar.month_name[i],)
                        for i in range(12, MONTH_IN_BASE_YEAR - 1, -1)]

    YEARS_BTW_BASE_AND_THIS_YEAR = [BASE_YEAR + yr for yr in range(
        THIS_YEAR - BASE_YEAR - 1, 0, -1)]
    ALL_MONTH_NAMES = [calendar.month_name[i] for i in range(12, 0, -1)]

    ALL_YEAR_MONTHS = THIS_YEAR_MONTHS + \
        [(yr, mon) for yr in YEARS_BTW_BASE_AND_THIS_YEAR
         for mon in ALL_MONTH_NAMES] + BASE_YEAR_MONTHS
    return ALL_YEAR_MONTHS


class LCVolumeAnalysisView(View):
    def get(self, request):
        return render(
            request, 'lc-volume-statistics.html',
            {'yrs_months': get_display_yr_month()})

    def post(self, request):
        data = request.POST
        years_mons = [val.split('-') for
                      val in data['selected-yrs-mons'].split(',')]

        results = []
        for yr, mon in years_mons:
            qs = LCRegister.objects.filter(
                estb_date__year=int(yr),
                estb_date__month=MONTHS_NAMES_INDEX[mon])

            statistics = LCRegister.get_statistics(qs)
            fmt = '{:,.2f}'
            results.append(
                ['%s - %s' % (yr, mon,), statistics[0]] +
                [fmt.format(x) for x in statistics[1:-1]])

        return render(
            request, 'lc-volume-statistics.html',
            {'yrs_months': get_display_yr_month(), 'rate': statistics[-1],
             'results': results}
        )

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        log.info(
            '[%s]::[%s %s]', request.user, request.method, request.path_info)
        return super(LCVolumeAnalysisView, self).dispatch(
            request, *args, **kwargs)


class LCDownloadView(View):
    def get(self, request):
        pass
