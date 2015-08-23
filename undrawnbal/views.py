from django.shortcuts import render
from django.views.generic import View
from .models import UndrawnBal
from .serializers import UndrawnBalSerializer
from rest_framework import generics


class RequestRefundView(View):
    def get(self, request):
        qs = UndrawnBal.objects.filter(pk__in=request.GET['ids'].split(','))
        return render(request, 'request-refund.html', {'objects': qs})

    def post(self, request):
        pass


class UndrawnBalAPIListView(generics.ListCreateAPIView):
    queryset = UndrawnBal.objects.all()
    serializer_class = UndrawnBalSerializer


class UndrawnBalAPIUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UndrawnBal.objects.all()
    serializer_class = UndrawnBalSerializer
