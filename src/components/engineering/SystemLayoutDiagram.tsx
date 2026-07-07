import type { ArrayLayoutResult } from "@/services/simulation/layout";

type SystemLayoutDiagramProps = {
  layout: ArrayLayoutResult;
  surfaceLabel: string;
};

const PADDING = 56;
const MAX_DRAW_WIDTH = 560;
const MAX_DRAW_HEIGHT = 340;

export function SystemLayoutDiagram({ layout, surfaceLabel }: SystemLayoutDiagramProps) {
  const { areaWidthM, areaHeightM, marginM, gapM, panelWidthM, panelHeightM, cols, panelsPlaced } = layout;

  const scale = Math.min(MAX_DRAW_WIDTH / areaWidthM, MAX_DRAW_HEIGHT / areaHeightM);
  const drawW = areaWidthM * scale;
  const drawH = areaHeightM * scale;
  const svgW = drawW + PADDING * 2;
  const svgH = drawH + PADDING * 2 + 24;

  const originX = PADDING;
  const originY = PADDING;

  const innerX = originX + marginM * scale;
  const innerY = originY + marginM * scale;
  const innerW = Math.max(0, drawW - 2 * marginM * scale);
  const innerH = Math.max(0, drawH - 2 * marginM * scale);

  const cellW = panelWidthM * scale;
  const cellH = panelHeightM * scale;
  const gapPx = gapM * scale;

  const panels = Array.from({ length: panelsPlaced }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: innerX + col * (cellW + gapPx),
      y: innerY + row * (cellH + gapPx)
    };
  });

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        height={svgH}
        className="min-w-[420px] text-slate-300 dark:text-slate-600"
        role="img"
        aria-label={`Plano de distribución de ${panelsPlaced} paneles sobre ${surfaceLabel} de ${areaWidthM} por ${areaHeightM} metros`}
      >
        <rect
          x={originX}
          y={originY}
          width={drawW}
          height={drawH}
          fill="none"
          stroke="currentColor"
          strokeDasharray="6 4"
          strokeWidth={1.5}
        />
        <rect
          x={innerX}
          y={innerY}
          width={innerW}
          height={innerH}
          fill="none"
          stroke="currentColor"
          strokeDasharray="2 3"
          strokeWidth={1}
          opacity={0.6}
        />

        {panels.map((panel, index) => (
          <rect
            key={index}
            x={panel.x}
            y={panel.y}
            width={cellW}
            height={cellH}
            rx={2}
            fill="url(#panelGradient)"
            stroke="rgb(30 41 59)"
            strokeWidth={0.75}
          />
        ))}

        <defs>
          <linearGradient id="panelGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Cota horizontal */}
        <line x1={originX} y1={originY + drawH + 20} x2={originX + drawW} y2={originY + drawH + 20} stroke="currentColor" strokeWidth={1} />
        <line x1={originX} y1={originY + drawH + 14} x2={originX} y2={originY + drawH + 26} stroke="currentColor" strokeWidth={1} />
        <line x1={originX + drawW} y1={originY + drawH + 14} x2={originX + drawW} y2={originY + drawH + 26} stroke="currentColor" strokeWidth={1} />
        <text
          x={originX + drawW / 2}
          y={originY + drawH + 40}
          textAnchor="middle"
          className="fill-slate-500 text-[11px] dark:fill-slate-400"
        >
          {areaWidthM.toFixed(1)} m
        </text>

        {/* Cota vertical */}
        <line x1={originX - 20} y1={originY} x2={originX - 20} y2={originY + drawH} stroke="currentColor" strokeWidth={1} />
        <line x1={originX - 26} y1={originY} x2={originX - 14} y2={originY} stroke="currentColor" strokeWidth={1} />
        <line x1={originX - 26} y1={originY + drawH} x2={originX - 14} y2={originY + drawH} stroke="currentColor" strokeWidth={1} />
        <text
          x={originX - 34}
          y={originY + drawH / 2}
          textAnchor="middle"
          transform={`rotate(-90 ${originX - 34} ${originY + drawH / 2})`}
          className="fill-slate-500 text-[11px] dark:fill-slate-400"
        >
          {areaHeightM.toFixed(1)} m
        </text>
      </svg>
    </div>
  );
}
