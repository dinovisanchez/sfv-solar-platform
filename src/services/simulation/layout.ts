export type PanelOrientation = "portrait" | "landscape";

export type ArrayLayoutInput = {
  areaWidthM: number;
  areaHeightM: number;
  panelWidthM: number;
  panelHeightM: number;
  panelsNeeded: number;
  marginM?: number;
  gapM?: number;
};

export type ArrayLayoutResult = {
  orientation: PanelOrientation;
  panelWidthM: number;
  panelHeightM: number;
  cols: number;
  rows: number;
  capacity: number;
  panelsPlaced: number;
  fits: boolean;
  missingPanels: number;
  areaWidthM: number;
  areaHeightM: number;
  marginM: number;
  gapM: number;
};

function capacityFor(
  usableWidthM: number,
  usableHeightM: number,
  panelWidthM: number,
  panelHeightM: number,
  gapM: number
) {
  const cols = Math.max(0, Math.floor((usableWidthM + gapM) / (panelWidthM + gapM)));
  const rows = Math.max(0, Math.floor((usableHeightM + gapM) / (panelHeightM + gapM)));
  return { cols, rows, capacity: cols * rows };
}

/**
 * Calcula cuantos paneles caben fisicamente en un techo/patio dado, probando
 * ambas orientaciones de montaje y dejando un margen perimetral de acceso
 * (Manual Maestro SS5.4: "distancias a bordes... caminos de mantenimiento").
 */
export function calculateArrayLayout(input: ArrayLayoutInput): ArrayLayoutResult {
  const marginM = input.marginM ?? 0.5;
  const gapM = input.gapM ?? 0.02;

  const usableWidthM = Math.max(0, input.areaWidthM - 2 * marginM);
  const usableHeightM = Math.max(0, input.areaHeightM - 2 * marginM);

  const portrait = capacityFor(usableWidthM, usableHeightM, input.panelWidthM, input.panelHeightM, gapM);
  const landscape = capacityFor(usableWidthM, usableHeightM, input.panelHeightM, input.panelWidthM, gapM);

  const usePortrait =
    portrait.capacity >= input.panelsNeeded
      ? true
      : landscape.capacity >= input.panelsNeeded
        ? false
        : portrait.capacity >= landscape.capacity;

  const chosen = usePortrait ? portrait : landscape;
  const panelWidthM = usePortrait ? input.panelWidthM : input.panelHeightM;
  const panelHeightM = usePortrait ? input.panelHeightM : input.panelWidthM;

  const panelsPlaced = Math.min(chosen.capacity, input.panelsNeeded);

  return {
    orientation: usePortrait ? "portrait" : "landscape",
    panelWidthM,
    panelHeightM,
    cols: chosen.cols,
    rows: chosen.rows,
    capacity: chosen.capacity,
    panelsPlaced,
    fits: chosen.capacity >= input.panelsNeeded,
    missingPanels: Math.max(0, input.panelsNeeded - chosen.capacity),
    areaWidthM: input.areaWidthM,
    areaHeightM: input.areaHeightM,
    marginM,
    gapM
  };
}
