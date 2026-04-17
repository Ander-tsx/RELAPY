import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
t_vals = np.linspace(0, 10, 500)
y_vals = np.exp(2*t_vals)
y_vals_clipped = np.clip(y_vals, -1e6, 1e6)
print("max clipped:", np.max(y_vals_clipped))
print("max real:", np.max(y_vals))
