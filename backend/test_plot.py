import numpy as np
from sympy import symbols, inverse_laplace_transform, simplify, lambdify, exp, sin, cos

t, s = symbols("t s", real=True, positive=True)

# y'' - y' - 2y = 4t
# L{y''} - L{y'} - 2L{y} = 4/s^2
# y(0)=0, y'(0)=1
# (s^2 Y - 1) - (s Y - 0) - 2 Y = 4/s^2
# (s^2 - s - 2) Y = 4/s^2 + 1
# Y = (4 + s^2) / (s^2 * (s^2 - s - 2))

Y_expr = (4 + s**2) / (s**2 * (s**2 - s - 2))
y_t = inverse_laplace_transform(Y_expr, s, t)
y_t = simplify(y_t)
print("y_t:", y_t)

f_numeric = lambdify(t, y_t, modules=["numpy"])
t_vals = np.linspace(0, 10, 5)
print("t_vals:", t_vals)
y_vals = f_numeric(t_vals)
print("y_vals:", y_vals)
