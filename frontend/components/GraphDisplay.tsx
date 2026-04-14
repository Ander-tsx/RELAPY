"use client";

interface Props {
  src: string | null;
}

export default function GraphDisplay({ src }: Props) {
  if (!src) {
    return (
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 220,
          borderStyle: "dashed",
          borderColor: "rgba(129,140,248,0.15)",
          gap: 14,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(129,140,248,0.07)",
            border: "1px solid rgba(129,140,248,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13 }}>
          Graph will appear after solving
        </p>
      </div>
    );
  }

  return (
    <div
      className="card animate-fade-in"
      style={{ padding: "16px", overflow: "hidden" }}
    >
      <span className="section-label" style={{ color: "#818cf8" }}>
        Graph — y(t)
      </span>
      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid rgba(129,140,248,0.2)",
          marginTop: 8,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="y(t) solution graph"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
