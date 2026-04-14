from rest_framework import serializers
from .models import SolverHistory


class InitialConditionsSerializer(serializers.Serializer):
    y0  = serializers.FloatField(default=0.0)
    dy0 = serializers.FloatField(default=0.0)


class SolveRequestSerializer(serializers.Serializer):
    equation           = serializers.CharField(max_length=500)
    initial_conditions = InitialConditionsSerializer()
    t_range            = serializers.ListField(
        child=serializers.FloatField(),
        min_length=2,
        max_length=2,
    )

    def validate_t_range(self, value):
        if value[0] >= value[1]:
            raise serializers.ValidationError(
                "t_range[0] debe ser menor que t_range[1]"
            )
        return value


class SolverHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = SolverHistory
        fields = [
            "id",
            "equation",
            "conditions",
            "laplace_equation",
            "laplace_solution",
            "time_solution",
            "created_at",
        ]
