from solver.math_core.parser import parse_equation
cases = [
    "y'' - y' - 2y = 4x",
    "y'' + y = 3",
    "2y'' - 3y' + y = 0",
    "y' = 5x"
]
for c in cases:
    print(c, parse_equation(c))
