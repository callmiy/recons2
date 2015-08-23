from django.conf.urls import (patterns, url)
from .views import RateView

urlpatterns = patterns(
    '',
    url('^$', RateView.as_view(), name='rate_home')
)
