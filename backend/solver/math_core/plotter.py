"""
plotter.py — Generates a styled matplotlib plot of y(t) as a base64 PNG.
"""

import io
import base64
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend — must be before pyplot import
import matplotlib.pyplot as plt
from sympy import lambdify, symbols


# Color palette matching the frontend design system
BG_COLOR   = "#0d0d0d"
FG_COLOR   = "#e8e8e8"
LINE_COLOR = "#6ee7b7"
GRID_COLOR = "#6ee7b7"
ACCENT     = "#818cf8"


def generate_plot(sympy_solution, t_range: list) -> str:
    """
    Convert sympy_solution to a numpy function, evaluate over t_range,
    and return a dark-styled plot encoded as "data:image/png;base64,<data>".

    Parameters
    ----------
    sympy_solution : SymPy Expr
        The y(t) expression returned by solve_with_laplace.
    t_range : list
        [t_min, t_max] — the evaluation range.

    Returns
    -------
    str
        "data:image/png;base64,..." ready to embed in an <img> tag.
    """
    t = symbols("t", real=True, positive=True)

    t_min, t_max = float(t_range[0]), float(t_range[1])
    t_vals = np.linspace(t_min, t_max, 500)

    # Create numerical function from SymPy expression
    f_numeric = lambdify(t, sympy_solution, modules=["numpy"])

    try:
        y_vals = f_numeric(t_vals)
        # lambdify may return a scalar when the expression is constant
        if np.isscalar(y_vals):
            y_vals = np.full_like(t_vals, float(y_vals))
        y_vals = np.array(y_vals, dtype=float)
        # Clip extreme values to avoid scale issues
        y_vals = np.clip(y_vals, -1e6, 1e6)
    except Exception:
        y_vals = np.zeros_like(t_vals)

    # ------------------------------------------------------------------ #
    # Build figure                                                         #
    # ------------------------------------------------------------------ #
    fig, ax = plt.subplots(figsize=(8, 4.5))
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)

    # Main plot line
    ax.plot(t_vals, y_vals, color=LINE_COLOR, linewidth=2.2, antialiased=True)

    # Zero reference line
    ax.axhline(0, color=FG_COLOR, linewidth=0.5, alpha=0.3)

    # Grid
    ax.grid(True, color=GRID_COLOR, alpha=0.15, linewidth=0.8)

    # Spines
    for spine in ax.spines.values():
        spine.set_edgecolor(FG_COLOR)
        spine.set_alpha(0.3)

    # Labels and title
    ax.set_xlabel("t", color=FG_COLOR, fontsize=12)
    ax.set_ylabel("y(t)", color=FG_COLOR, fontsize=12)
    ax.set_title("Solución y(t)", color=FG_COLOR, fontsize=14, pad=12)

    # Tick colors
    ax.tick_params(colors=FG_COLOR, which="both")

    plt.tight_layout(pad=1.5)

    # ------------------------------------------------------------------ #
    # Encode as base64 PNG                                                 #
    # ------------------------------------------------------------------ #
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=120, bbox_inches="tight",
                facecolor=BG_COLOR)
    plt.close(fig)
    buffer.seek(0)
    encoded = base64.b64encode(buffer.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"
