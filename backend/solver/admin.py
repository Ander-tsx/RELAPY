from django.contrib import admin
from .models import SolverHistory


@admin.register(SolverHistory)
class SolverHistoryAdmin(admin.ModelAdmin):
    list_display  = ("equation", "created_at")
    list_filter   = ("created_at",)
    search_fields = ("equation",)
    ordering      = ("-created_at",)
