import type { GridType } from "@/models/electrical";

type NodeSpec = {
  title: string;
  modelLabel: string;
  detail: string;
  accent: string;
};

type SingleLineDiagramProps = {
  arrayLabel: string;
  arraySubtitle: string;
  inverterLabel: string;
  inverterSubtitle: string;
  gridType: GridType;
  batteryLabel?: string;
  batterySubtitle?: string;
  transformerLabel?: string;
  transformerSubtitle?: string;
};

const BOX_W = 140;
const BOX_H = 80;
const GAP_X = 44;
const PADDING = 24;
const BATTERY_GAP_Y = 70;
const MAX_CHARS = 21;

function truncate(text: string): string {
  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS - 1)}…` : text;
}

function Node({ x, y, spec }: { x: number; y: number; spec: NodeSpec }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={BOX_W} height={BOX_H} rx={10} className="fill-white stroke-slate-300 dark:fill-slate-900 dark:stroke-white/15" strokeWidth={1.5} />
      <rect width={4} height={BOX_H} rx={2} fill={spec.accent} />
      <text x={BOX_W / 2} y={18} textAnchor="middle" className="fill-slate-800 text-[11px] font-semibold dark:fill-white">
        {spec.title}
      </text>
      <text x={BOX_W / 2} y={38} textAnchor="middle" className="fill-slate-600 text-[9.5px] dark:fill-slate-300">
        {truncate(spec.modelLabel)}
      </text>
      <text x={BOX_W / 2} y={54} textAnchor="middle" className="fill-slate-400 text-[9px] dark:fill-slate-500">
        {truncate(spec.detail)}
      </text>
    </g>
  );
}

function ConnectorArrow({ x1, y, x2 }: { x1: number; y: number; x2: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 8} y2={y} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={1.5} />
      <path d={`M ${x2 - 8} ${y - 4} L ${x2} ${y} L ${x2 - 8} ${y + 4} Z`} className="fill-slate-400 dark:fill-slate-500" />
    </g>
  );
}

export function SingleLineDiagram({
  arrayLabel,
  arraySubtitle,
  inverterLabel,
  inverterSubtitle,
  gridType,
  batteryLabel,
  batterySubtitle,
  transformerLabel,
  transformerSubtitle
}: SingleLineDiagramProps) {
  const gridLabel = gridType === "trifasica" ? "Red trifásica" : gridType === "bifasica" ? "Red bifásica" : "Red monofásica";

  const nodes: NodeSpec[] = [
    { title: "Arreglo FV", modelLabel: arrayLabel, detail: arraySubtitle, accent: "#1d4ed8" },
    { title: "Protecciones DC", modelLabel: "Seccionador · fusibles", detail: "SPD tipo 2", accent: "#2563eb" },
    { title: "Inversor", modelLabel: inverterLabel, detail: inverterSubtitle, accent: "#0f172a" },
    { title: "Protecciones AC", modelLabel: "Breaker interconexión", detail: "SPD AC", accent: "#d97706" }
  ];
  if (transformerLabel) {
    nodes.push({ title: "Transformador", modelLabel: transformerLabel, detail: transformerSubtitle ?? "", accent: "#d97706" });
  }
  nodes.push({ title: gridLabel, modelLabel: "Punto de conexión", detail: "Medidor bidireccional", accent: "#475569" });

  const mainY = PADDING;
  const width = nodes.length * BOX_W + (nodes.length - 1) * GAP_X + PADDING * 2;
  const hasBattery = Boolean(batteryLabel);
  const height = mainY + BOX_H + (hasBattery ? BATTERY_GAP_Y + BOX_H : 0) + PADDING;

  const inverterIndex = 2;
  const inverterX = PADDING + inverterIndex * (BOX_W + GAP_X);
  const batteryX = inverterX;
  const batteryY = mainY + BOX_H + BATTERY_GAP_Y;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Diagrama unifilar del sistema">
        {nodes.map((node, index) => {
          const x = PADDING + index * (BOX_W + GAP_X);
          return (
            <g key={node.title}>
              {index > 0 && <ConnectorArrow x1={x - GAP_X} y={mainY + BOX_H / 2} x2={x} />}
              <Node x={x} y={mainY} spec={node} />
            </g>
          );
        })}

        {hasBattery && (
          <>
            <line
              x1={inverterX + BOX_W / 2}
              y1={mainY + BOX_H}
              x2={batteryX + BOX_W / 2}
              y2={batteryY}
              className="stroke-slate-400 dark:stroke-slate-500"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <Node
              x={batteryX}
              y={batteryY}
              spec={{ title: "Batería", modelLabel: batteryLabel ?? "", detail: batterySubtitle ?? "", accent: "#16a34a" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
