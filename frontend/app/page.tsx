"use client";

import { useState } from "react";
import Link from "next/link";
import EquationInput from "@/components/EquationInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import GraphDisplay from "@/components/GraphDisplay";
import StepsPanel from "@/components/StepsPanel";
import { solveEquation, type SolveRequest, type SolveResponse } from "@/lib/api";
import axios from "axios";

export default function HomePage() {
  const [solution, setSolution] = useState<SolveResponse | null>(null);
  const [loading,  setLoading]  = useState<boolean>(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSolve = async (data: SolveRequest) => {
    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await solveEquation(data);
      setSolution(result);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error as string);
      } else if (axios.isAxiosError(err) && err.response?.data) {
        const msgs = Object.values(err.response.data).flat().join(" ");
        setError(msgs || "Unknown server error");
      } else {
        setError("Cannot reach the backend. Make sure the server is running on port 8000.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ============================================================ */}
      {/* Header                                                        */}
      {/* ============================================================ */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(110,231,183,0.1)",
          background: "rgba(13,13,13,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Monogram */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6ee7b7, #34d399)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                fontSize: 15,
                color: "#0d0d0d",
                flexShrink: 0,
              }}
            >
              ℒ
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#e8e8e8",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                RELAPY
              </h1>
              <p
                style={{
                  fontSize: 10,
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.06em",
                }}
              >
                Differential Equations via Laplace Transform
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/history"
              id="history-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                border: "1px solid rgba(110,231,183,0.2)",
                borderRadius: 8,
                color: "#6ee7b7",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                textDecoration: "none",
                fontWeight: 500,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(110,231,183,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              History
            </Link>
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* Hero band                                                     */}
      {/* ============================================================ */}
      <div
        style={{
          borderBottom: "1px solid rgba(110,231,183,0.06)",
          padding: "28px 32px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(110,231,183,0.04) 0%, transparent 65%)",
        }}
      >
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Enter your ODE below — symbolic solution via{" "}
          <span style={{ color: "#6ee7b7" }}>SymPy</span> &amp; rendered with{" "}
          <span style={{ color: "#818cf8" }}>KaTeX</span>
        </p>
      </div>

      {/* ============================================================ */}
      {/* Main two-column layout                                       */}
      {/* ============================================================ */}
      <main
        style={{
          flex: 1,
          maxWidth: 1400,
          margin: "0 auto",
          width: "100%",
          padding: "32px 32px 64px",
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* ---- Left panel ---- */}
        <aside
          style={{
            position: "sticky",
            top: 100,
          }}
        >
          <div className="card glow-border">
            <EquationInput onSolve={handleSolve} loading={loading} />
          </div>

          {/* Error message */}
          {error && (
            <div
              id="error-message"
              className="animate-slide-up"
              style={{
                marginTop: 16,
                padding: "14px 18px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#ef4444" }}>Error: </strong>
              {error}
            </div>
          )}
        </aside>

        {/* ---- Right panel ---- */}
        <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SolutionDisplay solution={solution} />
          <GraphDisplay data={solution?.graph_data ?? null} />
          <StepsPanel steps={solution?.steps ?? []} />
        </section>
      </main>

      {/* ============================================================ */}
      {/* Footer                                                        */}
      {/* ============================================================ */}
      <footer
        style={{
          borderTop: "1px solid rgba(110,231,183,0.08)",
          padding: "20px 32px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: 12,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        RELAPY · Laplace Transform ODE Solver · Powered by SymPy + Next.js 14
      </footer>
    </div>
  );
}
