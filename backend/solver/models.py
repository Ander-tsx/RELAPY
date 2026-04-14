from django.db import models


class SolverHistory(models.Model):
    equation        = models.CharField(max_length=500)
    conditions      = models.JSONField()
    laplace_equation = models.TextField()
    laplace_solution = models.TextField()
    time_solution   = models.TextField()
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.equation} @ {self.created_at:%Y-%m-%d %H:%M}"
