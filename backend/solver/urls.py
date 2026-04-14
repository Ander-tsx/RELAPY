from django.urls import path
from .views import SolveView, HistoryView

urlpatterns = [
    path("solve/",   SolveView.as_view(),   name="solve"),
    path("history/", HistoryView.as_view(), name="history"),
]
