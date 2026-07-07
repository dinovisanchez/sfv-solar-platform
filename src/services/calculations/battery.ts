export type BatteryChemistryDefaults = {
  dodUsable: number;
  roundTripEfficiency: number;
  degradationFactor: number;
};

/**
 * Valores de referencia por química (Guía Práctica §7 / Manual Maestro §5.3).
 * Se usan como default editable, no como dato certificado de un fabricante.
 */
export const BATTERY_CHEMISTRY_DEFAULTS: Record<"LFP" | "AGM_GEL", BatteryChemistryDefaults> = {
  LFP: { dodUsable: 0.9, roundTripEfficiency: 0.95, degradationFactor: 0.9 },
  AGM_GEL: { dodUsable: 0.5, roundTripEfficiency: 0.85, degradationFactor: 0.85 }
};

export type BatterySizingInput = {
  criticalDailyEnergyKwh: number;
  autonomyDays: number;
  dodUsable: number;
  roundTripEfficiency: number;
  degradationFactor: number;
};

export type BatterySizingResult = {
  requiredCapacityKwh: number;
};

/**
 * Capacidad nominal minima = energia critica diaria * dias de autonomia
 * / (DoD usable * eficiencia sistema * factor de degradacion).
 */
export function calculateBatterySizing(input: BatterySizingInput): BatterySizingResult {
  const denominator = input.dodUsable * input.roundTripEfficiency * input.degradationFactor;
  const requiredCapacityKwh =
    denominator > 0 ? (input.criticalDailyEnergyKwh * input.autonomyDays) / denominator : 0;

  return { requiredCapacityKwh };
}
