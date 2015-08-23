from django.views.generic import View
from django.shortcuts import render


__all__ = ("PostContingentView",)


class PostContingentView(View):

    def get(self, request):
        return render(request, "contingent_report/contingent-post.html")
