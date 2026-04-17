"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import type { GraphData } from "@/lib/api";

interface Props {
  data: GraphData | null;
}

// ─── Color tokens (matching design system) ─────────────────────────────────
const BG        = "#0d0d0d";
const SURFACE   = "#111111";
const LINE_CLR  = "#6ee7b7";
const AXIS_CLR  = "#4b5563";
const TICK_CLR  = "#6b7280";
const LABEL_CLR = "#9ca3af";
const GLOW_CLR  = "rgba(110,231,183,0.15)";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatNum(v: number): string {
  if (!isFinite(v)) return "—";
  const abs = Math.abs(v);
  if (abs === 0) return "0";
  if (abs >= 1e6)  return v.toExponential(3);
  if (abs >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (abs >= 1)    return v.toFixed(4);
  if (abs >= 0.01) return v.toFixed(6);
  return v.toExponential(3);
}

function smartDomain(yMin: number, yMax: number): [number, number] {
  const span = yMax - yMin;
  if (span === 0) return [yMin - 1, yMax + 1];
  const pad = span * 0.06;
  return [yMin - pad, yMax + pad];
}

// ─── Custom tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as { t: number; y: number | null };
  if (d.y == null) return null;
  return (
    <div
      style={{
        background: "rgba(13,13,13,0.96)",
        border: "1px solid rgba(110,231,183,0.25)",
        borderRadius: 8,
        padding: "8px 14px",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ color: LABEL_CLR, marginBottom: 3 }}>
        <span style={{ color: LINE_CLR }}>t</span> = {formatNum(d.t)}
      </div>
      <div style={{ color: "#e8e8e8", fontWeight: 600 }}>
        <span style={{ color: LINE_CLR }}>y(t)</span> = {formatNum(d.y)}
      </div>
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 280,
        borderStyle: "dashed",
        borderColor: "rgba(129,140,248,0.15)",
        flexDirection: "column",
        gap: 14,
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
      <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>
        La gráfica aparecerá aquí después de resolver
      </p>
    </div>
  );
}

// ─── Error state ────────────────────────────────────────────────────────────
function ErrorState({ msg }: { msg: string }) {
  return (
    <div
      className="card"
      style={{
        padding: "20px 24px",
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      <p style={{ color: "#fca5a5", fontSize: 13, fontFamily: "JetBrains Mono, monospace", margin: 0 }}>
        <strong style={{ color: "#ef4444" }}>Error al graficar: </strong>{msg}
      </p>
    </div>
  );
}

// ─── Stats bar ──────────────────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "6px 14px",
        background: "rgba(110,231,183,0.04)",
        border: "1px solid rgba(110,231,183,0.1)",
        borderRadius: 8,
        minWidth: 110,
      }}
    >
      <span style={{ color: LABEL_CLR, fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <span style={{ color: LINE_CLR, fontSize: 13, fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function GraphDisplay({ data }: Props) {
  if (!data) return <EmptyState />;
  if (data.has_error || data.t_values.length === 0) {
    return <ErrorState msg={data.error_msg ?? "Sin datos"} />;
  }

  // Build chart data array
  const chartData = data.t_values.map((t, i) => ({
    t,
    y: data.y_values[i],
  }));

  const [yLow, yHigh] = smartDomain(data.y_min ?? 0, data.y_max ?? 1);
  const tMin = data.t_values[0];
  const tMax = data.t_values[data.t_values.length - 1];
  const nPts = data.t_values.length;
  const nValid = data.y_values.filter((v) => v != null).length;

  // Tick counts
  const xTickCount = Math.min(10, Math.max(5, Math.floor((tMax - tMin) / 1) + 1));
  const yTickCount = 8;

  return (
    <div
      className="card animate-fade-in"
      style={{
        padding: "20px 20px 12px",
        background: `linear-gradient(160deg, rgba(110,231,183,0.03) 0%, ${BG} 60%)`,
        border: "1px solid rgba(110,231,183,0.18)",
        boxShadow: `0 0 40px ${GLOW_CLR}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            className="section-label"
            style={{ color: LINE_CLR, fontSize: 11, letterSpacing: "0.12em" }}
          >
            ▸ GRÁFICA INTERACTIVA — y(t)
          </span>
          <p
            style={{
              margin: "4px 0 0",
              color: LABEL_CLR,
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Pasa el cursor sobre la curva para ver valores exactos
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Stat label="t mín" value={formatNum(tMin)} />
          <Stat label="t máx" value={formatNum(tMax)} />
          <Stat label="y mín" value={formatNum(data.y_min ?? 0)} />
          <Stat label="y máx" value={formatNum(data.y_max ?? 0)} />
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{
          background: SURFACE,
          borderRadius: 10,
          border: "1px solid rgba(110,231,183,0.08)",
          padding: "16px 8px 8px 4px",
          overflow: "hidden",
        }}
      >
        <ResponsiveContainer width="100%" height={340}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 24, left: 8, bottom: 24 }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 6"
              stroke={AXIS_CLR}
              strokeOpacity={0.35}
              horizontal={true}
              vertical={true}
            />

            {/* Axes */}
            <XAxis
              dataKey="t"
              type="number"
              domain={[tMin, tMax]}
              tickCount={xTickCount}
              tickFormatter={(v: number) => formatNum(v)}
              tick={{ fill: TICK_CLR, fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: AXIS_CLR, strokeWidth: 1 }}
              tickLine={{ stroke: AXIS_CLR }}
              label={{
                value: "t",
                position: "insideBottomRight",
                offset: -8,
                fill: LABEL_CLR,
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                fontStyle: "italic",
              }}
            />
            <YAxis
              type="number"
              domain={[yLow, yHigh]}
              tickCount={yTickCount}
              tickFormatter={(v: number) => formatNum(v)}
              tick={{ fill: TICK_CLR, fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: AXIS_CLR, strokeWidth: 1 }}
              tickLine={{ stroke: AXIS_CLR }}
              width={80}
              label={{
                value: "y(t)",
                angle: -90,
                position: "insideLeft",
                offset: 14,
                fill: LABEL_CLR,
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                fontStyle: "italic",
              }}
            />

            {/* Zero reference lines */}
            {yLow < 0 && yHigh > 0 && (
              <ReferenceLine
                y={0}
                stroke="#ffffff"
                strokeOpacity={0.2}
                strokeWidth={1}
                strokeDasharray="6 4"
              />
            )}
            {tMin < 0 && tMax > 0 && (
              <ReferenceLine
                x={0}
                stroke="#ffffff"
                strokeOpacity={0.2}
                strokeWidth={1}
                strokeDasharray="6 4"
              />
            )}

            {/* Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "rgba(110,231,183,0.3)",
                strokeWidth: 1,
                strokeDasharray: "4 3",
              }}
            />

            {/* The solution curve */}
            <Line
              type="monotone"
              dataKey="y"
              stroke={LINE_CLR}
              strokeWidth={2.4}
              dot={false}
              activeDot={{
                r: 5,
                fill: LINE_CLR,
                stroke: BG,
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          padding: "0 4px",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#4b5563",
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {nValid}/{nPts} puntos válidos
        </span>
        {nValid < nPts && (
          <span
            style={{
              color: "#d97706",
              fontSize: 10,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            ⚠ {nPts - nValid} puntos fuera de rango (inf/nan)
          </span>
        )}
        <span
          style={{
            color: "#374151",
            fontSize: 10,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Powered by Recharts · SymPy
        </span>
      </div>
    </div>
  );
}
