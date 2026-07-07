export type CircuitType = "dc" | "ac-monofasica" | "ac-trifasica";

export type ConductorTableEntry = {
  awg: string;
  crossSectionMm2: number;
  resistanceOhmKm: number;
  ampacityA: number;
};

/**
 * Tabla de referencia (cobre, ~75°C, hasta 3 conductores portadores de
 * corriente en la misma canalización) equivalente a NTC 2050 / NEC 310.16.
 * La ampacidad real depende de temperatura ambiente, agrupamiento y tipo de
 * aislamiento del sitio — esta tabla es un punto de partida, no un
 * reemplazo del cálculo final verificado contra RETIE/NTC 2050.
 */
export const CONDUCTOR_TABLE: ConductorTableEntry[] = [
  { awg: "14 AWG", crossSectionMm2: 2.08, resistanceOhmKm: 9.35, ampacityA: 20 },
  { awg: "12 AWG", crossSectionMm2: 3.31, resistanceOhmKm: 5.92, ampacityA: 25 },
  { awg: "10 AWG", crossSectionMm2: 5.26, resistanceOhmKm: 3.75, ampacityA: 35 },
  { awg: "8 AWG", crossSectionMm2: 8.37, resistanceOhmKm: 2.36, ampacityA: 50 },
  { awg: "6 AWG", crossSectionMm2: 13.3, resistanceOhmKm: 1.5, ampacityA: 65 },
  { awg: "4 AWG", crossSectionMm2: 21.2, resistanceOhmKm: 0.945, ampacityA: 85 },
  { awg: "3 AWG", crossSectionMm2: 26.7, resistanceOhmKm: 0.75, ampacityA: 100 },
  { awg: "2 AWG", crossSectionMm2: 33.6, resistanceOhmKm: 0.594, ampacityA: 115 },
  { awg: "1 AWG", crossSectionMm2: 42.4, resistanceOhmKm: 0.47, ampacityA: 130 },
  { awg: "1/0 AWG", crossSectionMm2: 53.5, resistanceOhmKm: 0.373, ampacityA: 150 },
  { awg: "2/0 AWG", crossSectionMm2: 67.4, resistanceOhmKm: 0.296, ampacityA: 175 },
  { awg: "3/0 AWG", crossSectionMm2: 85.0, resistanceOhmKm: 0.235, ampacityA: 200 },
  { awg: "4/0 AWG", crossSectionMm2: 107.0, resistanceOhmKm: 0.187, ampacityA: 230 }
];

const CURRENT_SAFETY_FACTOR = 1.25;

export type ConductorRecommendation = {
  awg: string;
  crossSectionMm2: number;
  ampacityA: number;
  designCurrentA: number;
  voltageDropV: number;
  voltageDropPercent: number;
  meetsVoltageDropTarget: boolean;
  reasons: string[];
};

/**
 * Calibre minimo que cumple ampacidad (corriente x 1.25 de margen, criterio
 * NEC 690.8/RETIE para circuitos fotovoltaicos de operacion continua) y
 * caida de tension objetivo. DC y AC monofasica usan el factor 2 (ida y
 * vuelta); AC trifasica usa raiz de 3 (Guia Practica SS8-9).
 */
export function recommendConductor(params: {
  currentA: number;
  lengthM: number;
  nominalVoltageV: number;
  circuitType: CircuitType;
  maxVoltageDropPercent: number;
}): ConductorRecommendation {
  const designCurrentA = params.currentA * CURRENT_SAFETY_FACTOR;
  const dropFactor = params.circuitType === "ac-trifasica" ? Math.sqrt(3) : 2;

  function evaluate(entry: ConductorTableEntry) {
    const voltageDropV = dropFactor * params.lengthM * params.currentA * (entry.resistanceOhmKm / 1000);
    const voltageDropPercent = (voltageDropV / params.nominalVoltageV) * 100;
    return { voltageDropV, voltageDropPercent };
  }

  const candidate = CONDUCTOR_TABLE.find((entry) => {
    if (entry.ampacityA < designCurrentA) return false;
    return evaluate(entry).voltageDropPercent <= params.maxVoltageDropPercent;
  });

  const chosen = candidate ?? CONDUCTOR_TABLE[CONDUCTOR_TABLE.length - 1];
  const { voltageDropV, voltageDropPercent } = evaluate(chosen);
  const meetsAmpacity = chosen.ampacityA >= designCurrentA;
  const meetsVoltageDropTarget = voltageDropPercent <= params.maxVoltageDropPercent;

  const reasons = [
    `Corriente de diseño ${designCurrentA.toFixed(1)} A (${params.currentA.toFixed(1)} A × 1.25 de margen), ${chosen.awg} admite ${chosen.ampacityA} A${meetsAmpacity ? "" : " — insuficiente, se muestra el calibre mayor disponible en la tabla"}.`,
    `Caída de tensión con ${params.lengthM} m (una vía): ${voltageDropV.toFixed(2)} V (${voltageDropPercent.toFixed(2)}%), objetivo ≤${params.maxVoltageDropPercent}%${meetsVoltageDropTarget ? "" : " — no se alcanza con el calibre más grueso de la tabla; considerar acortar el recorrido o dividir el circuito"}.`,
    "Tabla de referencia (cobre, ~75°C, ≤3 conductores) equivalente a NTC 2050/NEC 310.16 — la ampacidad final depende de temperatura ambiente, agrupamiento y aislamiento reales del sitio."
  ];

  return {
    awg: chosen.awg,
    crossSectionMm2: chosen.crossSectionMm2,
    ampacityA: chosen.ampacityA,
    designCurrentA,
    voltageDropV,
    voltageDropPercent,
    meetsVoltageDropTarget,
    reasons
  };
}
