from django.conf.urls import patterns, include, url
from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from ajax_select import urls as ajax_select_urls

# Uncomment the next two lines to enable the admin:
from django.contrib import admin

from core_recons.views import CoreAppsView


class HomePageView(CoreAppsView):
    def get(self, request):
        context = {'urls': self.get_core_app_urls()}
        context.update(self.get_form_m_cover_types())
        return render(request, "core_recons/recons-base.html", context)


urlpatterns = patterns(
    '',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/lookups', include(ajax_select_urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', login_required(HomePageView.as_view()), name='home-url'),
    url(r'^chgs/', include('chgs.urls')),
    url(r'^entries/', include('postentry.urls')),
    url(r'^int/', include('ibdint.urls')),
    url(r'^lcavail/', include('lcavail.urls')),
    url(r'^recons-rates/', include('rateupload.urls')),
    url(r'^unmatched/', include('unmatched.urls')),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout_then_login', name='logout-then-login'),
    url(r'^undrawn/', include('undrawnbal.urls'), name='undrawn'),
    url(r'^adhoc-models/', include('adhocmodels.urls'), name='adhoc-models'),
    url(r'^contingent-report/', include('contingent_report.urls'), name='contingent-report'),
    url(r'^letter-of-credit/', include('letter_of_credit.url'), name='letter-of-credit'),
    url(r'^core-app/', include('core_recons.urls'), name='core-app'),
)
