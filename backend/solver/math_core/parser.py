"""
parser.py — Parses ODE strings into coefficient dictionaries.
Supports first and second order linear ODEs with constant coefficients.

Accepted formats:
  "y' + 2y = 0"
  "y'' + 3y' + 2y = 0"
  "y' - y = e^t"
  "y'' + y = sin(t)"
"""

import re


def _extract_coefficient(match_str: str) -> float:
    """
    Given a string like '+2', '-3', '+', '-', return the float coefficient.
    An empty string or bare '+'/'-' means ±1.
    """
    s = match_str.strip()
    if s in ("", "+"):
        return 1.0
    if s == "-":
        return -1.0
    try:
        return float(s)
    except ValueError:
        return 1.0 if "+" in s or s == "" else -1.0


def parse_equation(equation_str: str) -> dict:
    """
    Parse a linear ODE string and return a dict with:
      {
        "order": 1 | 2,
        "a2": float,   # coefficient of y''  (0 if first order)
        "a1": float,   # coefficient of y'
        "a0": float,   # coefficient of y
        "rhs": str,    # right-hand side: "0", "e^t", "sin(t)", etc.
      }

    Raises ValueError if the equation cannot be parsed.
    """
    raw = equation_str.strip()

    # Split on "="
    parts = raw.split("=")
    if len(parts) != 2:
        raise ValueError("Ecuación no soportada: debe contener exactamente un '='")

    lhs = parts[0].strip()
    rhs = parts[1].strip()

    # Normalise LHS: remove all spaces inside so regex is simpler
    lhs_norm = lhs.replace(" ", "")

    # ------------------------------------------------------------------ #
    # Detect order by presence of y'' or y" or y^(2)                     #
    # ------------------------------------------------------------------ #
    has_second = bool(re.search(r"y''|y\"", lhs_norm))
    has_first  = bool(re.search(r"y'|y\"", lhs_norm))   # covers '' too, handled below

    order = 2 if has_second else 1

    a2 = 0.0
    a1 = 0.0
    a0 = 0.0

    if order == 2:
        # ---- coefficient of y'' ----
        m = re.search(r"([+-]?\d*\.?\d*)y''", lhs_norm)
        if m:
            raw_coef = m.group(1)
            a2 = _extract_coefficient(raw_coef)
        else:
            # No explicit coefficient found; if y'' is there it's 1
            if "y''" in lhs_norm:
                a2 = 1.0

        # ---- coefficient of y' (single prime only) ----
        # Remove y'' first so y' match doesn't double-count
        lhs_no_second = lhs_norm.replace("y''", "")
        m = re.search(r"([+-]?\d*\.?\d*)y'", lhs_no_second)
        if m:
            raw_coef = m.group(1)
            a1 = _extract_coefficient(raw_coef)

        # ---- coefficient of y (no prime) ----
        lhs_no_deriv = re.sub(r"[+-]?\d*\.?\d*y''", "", lhs_norm)
        lhs_no_deriv = re.sub(r"[+-]?\d*\.?\d*y'", "", lhs_no_deriv)
        m = re.search(r"([+-]?\d*\.?\d*)y(?!')", lhs_no_deriv)
        if m:
            raw_coef = m.group(1)
            a0 = _extract_coefficient(raw_coef)

    else:  # order == 1
        # ---- coefficient of y' ----
        m = re.search(r"([+-]?\d*\.?\d*)y'", lhs_norm)
        if m:
            raw_coef = m.group(1)
            a1 = _extract_coefficient(raw_coef)
        else:
            if "y'" in lhs_norm:
                a1 = 1.0

        # ---- coefficient of y ----
        lhs_no_prime = re.sub(r"[+-]?\d*\.?\d*y'", "", lhs_norm)
        m = re.search(r"([+-]?\d*\.?\d*)y(?!')", lhs_no_prime)
        if m:
            raw_coef = m.group(1)
            a0 = _extract_coefficient(raw_coef)

    # Validate at least y' exists
    if order == 1 and a1 == 0.0:
        raise ValueError("Ecuación no soportada: no se encontró y'")
    if order == 2 and a2 == 0.0:
        raise ValueError("Ecuación no soportada: no se encontró y''")

    return {
        "order": order,
        "a2": a2,
        "a1": a1,
        "a0": a0,
        "rhs": rhs,
    }
