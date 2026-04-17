from sympy import symbols, Heaviside, lambdify
import numpy as np
t = symbols("t")
expr = Heaviside(t) * t
f = lambdify(t, expr, modules=["numpy"])
print(f(np.array([-1, 0, 1])))
