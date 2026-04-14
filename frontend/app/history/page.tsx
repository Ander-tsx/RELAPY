"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlockMath } from "react-katex";
import { getHistory, type HistoryItem } from "@/lib/api";

export default function HistoryPage() {
  const [items,   setItems]   = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch(() => setError("Failed to load history. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      year:   "numeric",
      month:  "short",
      day:    "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(110,231,183,0.1)",
          background: "rgba(13,13,13,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              }}
            >
              ℒ
            </div>
            <h1
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                fontSize: 18,
                color: "#e8e8e8",
              }}
            >
              RELAPY
            </h1>
          </div>
          <Link
            href="/"
            id="back-link"
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
            }}
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "40px 32px 80px",
        }}
      >
        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 28,
              fontWeight: 700,
              color: "#e8e8e8",
              marginBottom: 8,
            }}
          >
            Solution History
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            All previously solved equations, ordered by most recent.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#6b7280",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 14,
            }}
          >
            <span className="spinner" style={{ borderTopColor: "#6ee7b7", borderColor: "rgba(110,231,183,0.2)" }} />
            Loading history…
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: 60,
              borderStyle: "dashed",
              borderColor: "rgba(110,231,183,0.1)",
            }}
          >
            <p style={{ color: "#e8e8e8", marginBottom: 8, fontWeight: 500 }}>
              No solutions yet
            </p>
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              Solve your first equation from the{" "}
              <Link href="/" style={{ color: "#6ee7b7" }}>
                main page
              </Link>
            </p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="card animate-fade-in"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(110,231,183,0.3)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 24px rgba(110,231,183,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(110,231,183,0.15)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                {/* Equation */}
                <div>
                  <span className="section-label">Equation</span>
                  <p
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 14,
                      color: "#e8e8e8",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.equation}
                  </p>
                </div>

                {/* Conditions */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                  }}
                >
                  <div>
                    <span className="section-label" style={{ marginBottom: 2 }}>
                      y(0)
                    </span>
                    <p
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 13,
                        color: "#818cf8",
                      }}
                    >
                      {item.conditions?.y0 ?? 0}
                    </p>
                  </div>
                  <div>
                    <span className="section-label" style={{ marginBottom: 2 }}>
                      y&apos;(0)
                    </span>
                    <p
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 13,
                        color: "#818cf8",
                      }}
                    >
                      {item.conditions?.dy0 ?? 0}
                    </p>
                  </div>
                </div>

                {/* Final solution */}
                <div
                  style={{
                    background: "rgba(110,231,183,0.04)",
                    border: "1px solid rgba(110,231,183,0.15)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    overflowX: "auto",
                  }}
                >
                  <span className="section-label" style={{ color: "#6ee7b7" }}>
                    y(t)
                  </span>
                  <div style={{ fontSize: "0.9em" }}>
                    <BlockMath math={item.time_solution} />
                  </div>
                </div>

                {/* Timestamp */}
                <p
                  style={{
                    fontSize: 11,
                    color: "#4b5563",
                    fontFamily: "JetBrains Mono, monospace",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    paddingTop: 10,
                    marginTop: 2,
                  }}
                >
                  {formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
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
        RELAPY · Solution History
      </footer>
    </div>
  );
}
