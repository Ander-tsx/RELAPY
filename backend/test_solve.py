from solver.math_core.parser import parse_equation
from solver.math_core.laplace import solve_with_laplace
from solver.math_core.plotter import generate_plot
from sympy import symbols, Heaviside
import numpy as np

# A typical equation that might trigger Heaviside issue, or maybe standard ones
eq = "y'' - y' - 2y = 4t" # previously "4x", we changed to "4t" by the replace tool
parsed = parse_equation(eq)
result = solve_with_laplace(parsed, y0=0, dy0=1)
y_t = result["sympy_solution"]
print("y_t:", y_t)
try:
    generate_plot(y_t, [0, 10])
    print("plot generated successfully")
except Exception as e:
    print("plot failed:", e)
