# RELAPY — Laplace Transform ODE Solver

A full-stack web application for solving first and second order linear ODEs
using the **Laplace Transform**. Enter an equation, set initial conditions,
and get the symbolic solution with step-by-step working and an interactive graph.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11 · Django 4.2 · Django REST Framework |
| Math | SymPy (symbolic) · NumPy (numeric) · Matplotlib (plots) |
| Frontend | Next.js 14 App Router · TypeScript · TailwindCSS |
| Rendering | react-katex · KaTeX |

---

## Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

---

### 1 · Backend

```bash
# From the project root
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# (Optional) Create admin superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The API will be available at **http://localhost:8000**.

---

### 2 · Frontend

```bash
# From the project root
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The UI will be available at **http://localhost:3000**.

---

## API Reference

### `POST /api/solve/`

**Request body:**
```json
{
  "equation": "y'' + 3y' + 2y = 0",
  "initial_conditions": { "y0": 0, "dy0": 1 },
  "t_range": [0, 10]
}
```

**Response:**
```json
{
  "original_equation": "y'' + 3y' + 2y = 0",
  "laplace_equation": "...",
  "laplace_solution": "Y(s) = ...",
  "time_solution": "y(t) = ...",
  "steps": ["...", "..."],
  "graph_base64": "data:image/png;base64,..."
}
```

### `GET /api/history/`

Returns all previously solved equations ordered by most recent.

---

## Supported Equation Formats

| Input String | Description |
|---|---|
| `y' + 2y = 0` | 1st order homogeneous |
| `y'' + 3y' + 2y = 0` | 2nd order homogeneous |
| `y' - y = e^t` | 1st order, exponential forcing |
| `y'' + y = sin(t)` | 2nd order, sinusoidal forcing |
| `y'' + y = cos(t)` | 2nd order, cosine forcing |
| `y' + y = e^{-2t}` | Exponential with coefficient in exponent |

---

## Test Cases & Expected Solutions

| # | Equation | y(0) | y'(0) | Expected y(t) |
|---|----------|------|-------|---------------|
| 1 | `y' + 2y = 0` | 1 | — | `e^{-2t}` |
| 2 | `y'' + 3y' + 2y = 0` | 0 | 1 | `e^{-t} - e^{-2t}` |
| 3 | `y' - y = e^t` | 1 | — | `e^t (1 + t)` |
| 4 | `y'' + y = sin(t)` | 0 | 0 | `(sin(t) - t cos(t)) / 2` |

---

## Project Structure

```
laplace-solver/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                  # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   └── solver/                  # Main app
│       ├── math_core/
│       │   ├── parser.py        # Regex-based ODE parser
│       │   ├── laplace.py       # Symbolic Laplace solver
│       │   └── plotter.py       # Matplotlib graph generator
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
└── frontend/
    ├── app/
    │   ├── page.tsx             # Main solver UI
    │   └── history/page.tsx     # History page
    ├── components/
    │   ├── EquationInput.tsx
    │   ├── SolutionDisplay.tsx
    │   ├── GraphDisplay.tsx
    │   └── StepsPanel.tsx
    └── lib/api.ts               # Typed API client
```
