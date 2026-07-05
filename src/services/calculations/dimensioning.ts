export type DimensioningInput = {
  monthlyConsumptionKwh: number;
  targetCoveragePercent: number;
  hsp: number;
  panelWatts: number;
  inverterKw: number;
  performanceRatio: number;
};

export type DimensioningResult = {
  dailyConsumptionKwh: number;
  targetDailyEnergyKwh: number;
  requiredKwp: number;
  panelCount: number;
  realDcKwp: number;
  dcAcRatio: number;
  estimatedMonthlyKwh: number;
};

/**
 * Fórmula preliminar de dimensionamiento (Guía Práctica §14). No reemplaza
 * simulación horaria ni validación de strings contra ficha técnica real.
 */
export function calculateDimensioning(input: DimensioningInput): DimensioningResult {
  const dailyConsumptionKwh = input.monthlyConsumptionKwh / 30;
  const targetDailyEnergyKwh = dailyConsumptionKwh * (input.targetCoveragePercent / 100);
  const requiredKwp = targetDailyEnergyKwh / (input.hsp * input.performanceRatio);
  const panelCount = Math.max(1, Math.ceil((requiredKwp * 1000) / input.panelWatts));
  const realDcKwp = (panelCount * input.panelWatts) / 1000;
  const dcAcRatio = realDcKwp / input.inverterKw;
  const estimatedMonthlyKwh = realDcKwp * input.hsp * input.performanceRatio * 30;

  return {
    dailyConsumptionKwh,
    targetDailyEnergyKwh,
    requiredKwp,
    panelCount,
    realDcKwp,
    dcAcRatio,
    estimatedMonthlyKwh
  };
}

export function estimateCoverageScore(result: DimensioningResult, monthlyConsumptionKwh: number): number {
  if (monthlyConsumptionKwh <= 0) return 0;
  return Math.min(99, Math.round((result.estimatedMonthlyKwh / monthlyConsumptionKwh) * 100));
}

export const DC_AC_RATIO_WARNING_THRESHOLD = 1.35;
