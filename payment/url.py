from django.contrib.auth.decorators import login_required
from django.conf.urls import url, patterns
from payment.views import PaymentHomeView

urlpatterns = patterns(
    # <editor-fold description='home view and upload'>
    '',

    url(r'^home/?$', login_required(PaymentHomeView.as_view()), name='payment-home'),
    # </editor-fold>
)
