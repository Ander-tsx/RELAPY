from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from .serializers import SolveRequestSerializer, SolverHistorySerializer
from .models import SolverHistory
from .math_core.parser import parse_equation
from .math_core.laplace import solve_with_laplace
from .math_core.plotter import generate_plot


class SolveView(APIView):
    """
    POST /api/solve/
    Accepts an equation string, initial conditions and t_range.
    Returns LaTeX strings, solution steps and a base64 graph.
    """

    def post(self, request):
        serializer = SolveRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        equation_str = data["equation"]
        y0  = data["initial_conditions"]["y0"]
        dy0 = data["initial_conditions"]["dy0"]
        t_range = data["t_range"]

        # ---- Parse equation ----
        try:
            parsed = parse_equation(equation_str)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        # ---- Solve via Laplace ----
        try:
            result = solve_with_laplace(parsed, y0=y0, dy0=dy0)
        except Exception as exc:
            return Response(
                {"error": f"Error al resolver: {str(exc)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ---- Generate plot ----
        try:
            graph_b64 = generate_plot(result["sympy_solution"], t_range)
        except Exception as exc:
            graph_b64 = ""

        # ---- Persist to history ----
        SolverHistory.objects.create(
            equation=equation_str,
            conditions={"y0": y0, "dy0": dy0},
            laplace_equation=result["laplace_equation"],
            laplace_solution=result["laplace_solution"],
            time_solution=result["time_solution"],
        )

        return Response(
            {
                "original_equation": equation_str,
                "laplace_equation":  result["laplace_equation"],
                "laplace_solution":  result["laplace_solution"],
                "time_solution":     result["time_solution"],
                "steps":             result["steps"],
                "graph_base64":      graph_b64,
            },
            status=status.HTTP_200_OK,
        )


class HistoryView(generics.ListAPIView):
    """
    GET /api/history/
    Returns all previous solver runs ordered by most recent.
    """
    queryset         = SolverHistory.objects.all()
    serializer_class = SolverHistorySerializer
