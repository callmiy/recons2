from django.shortcuts import render
from core_recons.views import CoreAppsView


class PaymentHomeView(CoreAppsView):
    def get(self, request):
        return render(request, 'payment/index.html', {'urls': self.get_core_app_urls()})
