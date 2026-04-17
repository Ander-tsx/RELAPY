"""
plotter.py — Computes numerical y(t) data points for the interactive frontend chart.

Instead of returning a static PNG, this module evaluates the SymPy solution
over the requested t range and returns structured data (lists of t/y values)
that the React frontend renders as an interactive, zoomable chart.
"""

import numpy as np
from sympy import lambdify, symbols, Heaviside, Piecewise, expand, zoo, oo, nan
from typing import Optional


# Number of points to evaluate
N_POINTS = 600


def compute_plot_data(sympy_solution, t_range: list) -> dict:
    """
    Evaluate sympy_solution numerically over t_range and return structured data.

    Parameters
    ----------
    sympy_solution : SymPy Expr
        The y(t) expression returned by solve_with_laplace.
    t_range : list
        [t_min, t_max] — the evaluation range.

    Returns
    -------
    dict with keys:
        t_values  : list[float]   — x-axis data
        y_values  : list[float]   — y-axis data (None where invalid)
        y_min     : float | None
        y_max     : float | None
        has_error : bool
        error_msg : str | None
    """
    t = symbols("t", real=True, positive=True)

    t_min, t_max = float(t_range[0]), float(t_range[1])
    if t_min >= t_max:
        return _error_result("t_min debe ser menor que t_max")

    t_vals = np.linspace(t_min, t_max, N_POINTS)

    # ------------------------------------------------------------------ #
    # Expand the expression to avoid nested factored forms like           #
    # (A*exp(3t) + B)*exp(-t) which can cause precision issues           #
    # ------------------------------------------------------------------ #
    try:
        expr = expand(sympy_solution)
    except Exception:
        expr = sympy_solution

    # ------------------------------------------------------------------ #
    # Build numeric function via lambdify                                 #
    # ------------------------------------------------------------------ #
    try:
        f_numeric = lambdify(t, expr, modules=["numpy"])
    except Exception as exc:
        return _error_result(f"No se pudo lambdify la expresión: {exc}")

    try:
        y_vals_raw = f_numeric(t_vals)

        # Handle scalar output (constant solution)
        if np.isscalar(y_vals_raw):
            y_vals_raw = np.full_like(t_vals, float(y_vals_raw))

        y_vals = np.array(y_vals_raw, dtype=float)

    except Exception as exc:
        return _error_result(f"Error evaluando y(t): {exc}")

    # ------------------------------------------------------------------ #
    # Smart clipping: replace only true NaN/Inf without hiding asymptotes #
    # ------------------------------------------------------------------ #
    finite_mask = np.isfinite(y_vals)
    if finite_mask.sum() == 0:
        return _error_result("La solución no produjo valores finitos en el rango dado")

    # Compute stats on finite values only
    y_finite = y_vals[finite_mask]
    y_data_min = float(np.min(y_finite))
    y_data_max = float(np.max(y_finite))

    # Replace inf/nan with None so Recharts can handle gaps
    y_out: list[Optional[float]] = []
    for v in y_vals:
        if np.isfinite(v):
            y_out.append(round(float(v), 8))
        else:
            y_out.append(None)

    t_out = [round(float(v), 8) for v in t_vals]

    return {
        "t_values":  t_out,
        "y_values":  y_out,
        "y_min":     round(y_data_min, 8),
        "y_max":     round(y_data_max, 8),
        "has_error": False,
        "error_msg": None,
    }


def _error_result(msg: str) -> dict:
    return {
        "t_values":  [],
        "y_values":  [],
        "y_min":     None,
        "y_max":     None,
        "has_error": True,
        "error_msg": msg,
    }
