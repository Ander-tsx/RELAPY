"use client";

import { useState } from "react";

interface Props {
  steps: string[];
}

export default function StepsPanel({ steps }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div
      className="card animate-slide-up"
      style={{ padding: 0, overflow: "hidden" }}
    >
      {/* Toggle header */}
      <button
        id="steps-toggle-btn"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#818cf8",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Solution Steps ({steps.length})
        </span>
        <span
          style={{
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Collapsible content */}
      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(129,140,248,0.15)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(129,140,248,0.12)",
                  border: "1px solid rgba(129,140,248,0.25)",
                  color: "#818cf8",
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "JetBrains Mono, monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {idx + 1}
              </span>
              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 12,
                  color: "#818cf8",
                  lineHeight: 1.6,
                  wordBreak: "break-all",
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
