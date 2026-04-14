"""
laplace.py — Solves linear ODEs symbolically via Laplace Transform.

Given the parsed ODE dictionary and initial conditions (y0, dy0),
constructs the algebraic equation in the s-domain, solves for Y(s),
then applies the inverse Laplace transform to obtain y(t).
"""

import re
from sympy import (
    symbols, Function, exp, sin, cos, solve,
    inverse_laplace_transform, simplify, nsimplify,
    latex, Rational, S
)


def _rhs_to_sympy(rhs_str: str):
    """
    Convert the right-hand side string to a SymPy expression.

    Supports:
      "0"              → 0
      numeric literal  → Rational approximation
      "e^t"            → exp(t)
      "e^{at}"         → exp(a*t)   (a is a literal number or symbol)
      "e^{-2t}"        → exp(-2*t)
      "sin(t)"         → sin(t)
      "cos(t)"         → cos(t)
    """
    t = symbols("t", real=True, positive=True)
    s = rhs_str.strip()

    if s == "0":
        return S.Zero

    # Pure numeric constant
    try:
        value = float(s)
        return nsimplify(value)
    except ValueError:
        pass

    # e^t  or  e^{expr}
    # Match e^t  (no braces)
    m = re.fullmatch(r"e\^t", s)
    if m:
        return exp(t)

    # Match e^{...}
    m = re.fullmatch(r"e\^\{([^}]+)\}", s)
    if m:
        inner = m.group(1).strip()          # e.g. "at",  "-2t", "3t"
        # Parse coefficient of t in inner
        coef_match = re.fullmatch(r"([+-]?\d*\.?\d*)[a-zA-Z]?t", inner)
        if coef_match:
            coef_str = coef_match.group(1)
            if coef_str in ("", "+"):
                coef = S.One
            elif coef_str == "-":
                coef = S.NegativeOne
            else:
                coef = nsimplify(float(coef_str))
            return exp(coef * t)
        # Fallback: treat inner as just a coefficient times t
        raise ValueError(f"No se pudo parsear el exponente: {inner}")

    # sin(t)
    m = re.fullmatch(r"sin\(t\)", s)
    if m:
        return sin(t)

    # cos(t)
    m = re.fullmatch(r"cos\(t\)", s)
    if m:
        return cos(t)

    raise ValueError(f"RHS no soportado: '{rhs_str}'")


def _laplace_of_rhs(rhs_expr) -> object:
    """
    Return L{rhs_expr}(s) using known transforms:
      L{0}      = 0
      L{e^{at}} = 1/(s-a)
      L{sin(t)} = 1/(s²+1)
      L{cos(t)} = s/(s²+1)
      L{c}      = c/s   (constant)
    """
    t, s = symbols("t s", real=True, positive=True)

    if rhs_expr == S.Zero:
        return S.Zero

    from sympy import laplace_transform
    # Use SymPy's built-in; it handles all standard forms
    L_rhs, _, _ = laplace_transform(rhs_expr, t, s)
    return L_rhs


def solve_with_laplace(parsed: dict, y0: float, dy0: float) -> dict:
    """
    Solve the ODE using Laplace Transform.

    Parameters
    ----------
    parsed : dict
        Output of parser.parse_equation()
    y0 : float
        Initial condition y(0)
    dy0 : float
        Initial condition y'(0)  (ignored for first-order ODEs)

    Returns
    -------
    dict with keys:
        laplace_equation : str   (LaTeX)
        laplace_solution : str   (LaTeX)
        time_solution    : str   (LaTeX)
        sympy_solution   : Expr  (SymPy expression of y(t))
        steps            : list[str]
    """
    t, s = symbols("t s", real=True, positive=True)
    Y = symbols("Y")

    order = parsed["order"]
    a2    = parsed["a2"]
    a1    = parsed["a1"]
    a0    = parsed["a0"]
    rhs_str = parsed["rhs"]

    steps = []

    # ------------------------------------------------------------------ #
    # Step 1 — Convert RHS to SymPy                                       #
    # ------------------------------------------------------------------ #
    try:
        rhs_expr = _rhs_to_sympy(rhs_str)
    except ValueError as exc:
        raise ValueError(str(exc))

    steps.append(f"Término no homogéneo: f(t) = {rhs_str}")

    # ------------------------------------------------------------------ #
    # Step 2 — Compute L{f(t)}                                           #
    # ------------------------------------------------------------------ #
    L_rhs = _laplace_of_rhs(rhs_expr)
    steps.append(f"L{{f(t)}}(s) = {latex(L_rhs)}")

    # ------------------------------------------------------------------ #
    # Step 3 — Build algebraic equation in s-domain                      #
    # Apply:                                                              #
    #   L{y'}  = s*Y - y0                                                #
    #   L{y''} = s²*Y - s*y0 - dy0                                      #
    # ------------------------------------------------------------------ #
    if order == 1:
        # a1*(s*Y - y0) + a0*Y = L_rhs
        lhs_s = a1 * (s * Y - y0) + a0 * Y
        laplace_eq_latex = (
            f"{_fmt(a1)}(sY(s) - {y0}) "
            f"{_signed_term(a0, 'Y(s)')} = {latex(L_rhs)}"
        )
        steps.append(
            f"Ecuación en dominio s: {a1}(sY - {y0}) + {a0}Y = {latex(L_rhs)}"
        )
    else:
        # a2*(s²*Y - s*y0 - dy0) + a1*(s*Y - y0) + a0*Y = L_rhs
        lhs_s = (
            a2 * (s**2 * Y - s * y0 - dy0)
            + a1 * (s * Y - y0)
            + a0 * Y
        )
        laplace_eq_latex = (
            f"{_fmt(a2)}(s^2 Y(s) - {y0}s - {dy0}) "
            f"{_signed_term(a1, f'(sY(s) - {y0})')} "
            f"{_signed_term(a0, 'Y(s)')} = {latex(L_rhs)}"
        )
        steps.append(
            f"Ecuación en dominio s: "
            f"{a2}(s²Y - {y0}s - {dy0}) + {a1}(sY - {y0}) + {a0}Y = {latex(L_rhs)}"
        )

    # ------------------------------------------------------------------ #
    # Step 4 — Solve for Y(s)                                            #
    # ------------------------------------------------------------------ #
    equation_in_Y = lhs_s - L_rhs
    solutions = solve(equation_in_Y, Y)

    if not solutions:
        raise ValueError("No se pudo resolver para Y(s)")

    Y_expr = simplify(solutions[0])
    steps.append(f"Y(s) = {latex(Y_expr)}")

    # ------------------------------------------------------------------ #
    # Step 5 — Inverse Laplace Transform                                 #
    # ------------------------------------------------------------------ #
    y_t = inverse_laplace_transform(Y_expr, s, t)
    y_t = simplify(y_t)
    steps.append(f"y(t) = L⁻¹{{Y(s)}} = {latex(y_t)}")

    # LaTeX strings
    laplace_solution_latex = f"Y(s) = {latex(Y_expr)}"
    time_solution_latex    = f"y(t) = {latex(y_t)}"

    return {
        "laplace_equation": laplace_eq_latex,
        "laplace_solution": laplace_solution_latex,
        "time_solution":    time_solution_latex,
        "sympy_solution":   y_t,
        "steps":            steps,
    }


# ------------------------------------------------------------------ #
# Helpers for LaTeX formatting                                        #
# ------------------------------------------------------------------ #

def _fmt(coef: float) -> str:
    """Format a float coefficient: drop .0 if integer."""
    if coef == int(coef):
        return str(int(coef))
    return str(coef)


def _signed_term(coef: float, term: str) -> str:
    """Return '+2Y(s)' or '-3Y(s)' string for LaTeX building."""
    if coef == 0:
        return ""
    sign = "+" if coef > 0 else "-"
    abs_c = abs(coef)
    c_str = _fmt(abs_c) if abs_c != 1.0 else ""
    return f" {sign} {c_str}{term}"
