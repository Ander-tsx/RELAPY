"use client";

import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import type { SolveResponse } from "@/lib/api";

interface Props {
  solution: SolveResponse | null;
}

export default function SolutionDisplay({ solution }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyGeoGebra = () => {
    if (solution?.plain_solution) {
      navigator.clipboard.writeText(`y = ${solution.plain_solution}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!solution) {
    return (
      <div
        className="card animate-fade-in"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          gap: 16,
          borderStyle: "dashed",
          borderColor: "rgba(110,231,183,0.1)",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(110,231,183,0.07)",
            border: "1px solid rgba(110,231,183,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#e8e8e8", fontWeight: 500, marginBottom: 6 }}>
            No solution yet
          </p>
          <p style={{ color: "#6b7280", fontSize: 13 }}>
            Enter an equation on the left and click{" "}
            <span style={{ color: "#6ee7b7" }}>Solve Equation</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      {/* Original Equation */}
      <div className="card">
        <span className="section-label">Original Equation</span>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 16,
            color: "#e8e8e8",
            padding: "8px 0",
          }}
        >
          <InlineMath math={solution.original_equation} />
        </div>
      </div>

      {/* Laplace Transform */}
      <div className="card">
        <span className="section-label">Laplace Transform</span>
        <div
          style={{
            overflowX: "auto",
            padding: "4px 0",
          }}
        >
          <BlockMath math={solution.laplace_equation} />
        </div>
      </div>

      {/* Y(s) */}
      <div className="card">
        <span className="section-label">Solution in s-domain Y(s)</span>
        <div style={{ overflowX: "auto", padding: "4px 0" }}>
          <BlockMath math={solution.laplace_solution} />
        </div>
      </div>

      {/* y(t) — highlighted */}
      <div
        className="card"
        style={{
          border: "1px solid rgba(110,231,183,0.35)",
          background:
            "linear-gradient(135deg, rgba(110,231,183,0.05) 0%, rgba(13,13,13,0) 100%)",
          boxShadow: "0 0 30px rgba(110,231,183,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="section-label" style={{ color: "#6ee7b7", margin: 0 }}>
            ✦ Final Solution y(t)
          </span>
          {solution.plain_solution && (
            <button
              onClick={handleCopyGeoGebra}
              style={{
                background: "rgba(110,231,183,0.1)",
                border: "1px solid rgba(110,231,183,0.2)",
                color: "#6ee7b7",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(110,231,183,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(110,231,183,0.1)")}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
        <div
          style={{
            overflowX: "auto",
            padding: "6px 0",
          }}
        >
          <div style={{ fontSize: "1.2em" }}>
            <BlockMath math={solution.time_solution} />
          </div>
        </div>
      </div>
    </div>
  );
}
