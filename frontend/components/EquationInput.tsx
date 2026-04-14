"use client";

import { useState } from "react";
import type { SolveRequest } from "@/lib/api";

interface Props {
  onSolve: (data: SolveRequest) => void;
  loading: boolean;
}

const EXAMPLES = [
  { label: "1st order homogeneous", eq: "y' + 2y = 0",      y0: 1, dy0: 0 },
  { label: "2nd order homogeneous", eq: "y'' + 3y' + 2y = 0", y0: 0, dy0: 1 },
  { label: "1st order with e^t",   eq: "y' - y = e^t",      y0: 1, dy0: 0 },
  { label: "2nd order with sin(t)",eq: "y'' + y = sin(t)",  y0: 0, dy0: 0 },
];

export default function EquationInput({ onSolve, loading }: Props) {
  const [equation, setEquation] = useState<string>("y'' + 3y' + 2y = 0");
  const [y0,  setY0]  = useState<number>(0);
  const [dy0, setDy0] = useState<number>(1);
  const [tMin, setTMin] = useState<number>(0);
  const [tMax, setTMax] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSolve({
      equation,
      initial_conditions: { y0, dy0 },
      t_range: [tMin, tMax],
    });
  };

  const applyExample = (ex: typeof EXAMPLES[0]) => {
    setEquation(ex.eq);
    setY0(ex.y0);
    setDy0(ex.dy0);
    setTMin(0);
    setTMax(10);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Quick Examples */}
      <div>
        <span className="section-label">Quick examples</span>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.eq}
              type="button"
              onClick={() => applyExample(ex)}
              className="text-left px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150"
              style={{
                background: "rgba(110,231,183,0.05)",
                border: "1px solid rgba(110,231,183,0.12)",
                color: "#e8e8e8",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(110,231,183,0.1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(110,231,183,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(110,231,183,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(110,231,183,0.12)";
              }}
            >
              <span style={{ color: "#6ee7b7", marginRight: 8 }}>→</span>
              <span style={{ color: "#818cf8" }}>{ex.label}:</span>{" "}
              {ex.eq}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Equation */}
        <div>
          <label
            htmlFor="equation-input"
            className="section-label"
          >
            Equation
          </label>
          <input
            id="equation-input"
            type="text"
            className="input-base"
            placeholder="y'' + 3y' + 2y = 0"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            disabled={loading}
            required
            spellCheck={false}
            autoComplete="off"
          />
          <p
            style={{
              fontSize: 11,
              color: "#6b7280",
              marginTop: 5,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Use: y&apos; y&apos;&apos; e^t sin(t) cos(t) e^&#123;at&#125;
          </p>
        </div>

        {/* Initial Conditions */}
        <div>
          <span className="section-label">Initial conditions</span>
          <div className="flex gap-3">
            <div style={{ flex: 1 }}>
              <label
                htmlFor="y0-input"
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                y(0)
              </label>
              <input
                id="y0-input"
                type="number"
                step="any"
                className="input-base"
                value={y0}
                onChange={(e) => setY0(parseFloat(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="dy0-input"
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                y&apos;(0)
              </label>
              <input
                id="dy0-input"
                type="number"
                step="any"
                className="input-base"
                value={dy0}
                onChange={(e) => setDy0(parseFloat(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* t Range */}
        <div>
          <span className="section-label">Plot range</span>
          <div className="flex gap-3">
            <div style={{ flex: 1 }}>
              <label
                htmlFor="tmin-input"
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                t min
              </label>
              <input
                id="tmin-input"
                type="number"
                step="any"
                className="input-base"
                value={tMin}
                onChange={(e) => setTMin(parseFloat(e.target.value) || 0)}
                disabled={loading}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="tmax-input"
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                t max
              </label>
              <input
                id="tmax-input"
                type="number"
                step="any"
                className="input-base"
                value={tMax}
                onChange={(e) => setTMax(parseFloat(e.target.value) || 10)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          id="solve-button"
          type="submit"
          className="btn-primary w-full"
          disabled={loading || equation.trim() === ""}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Solving…
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              Solve Equation
            </>
          )}
        </button>
      </form>
    </div>
  );
}
