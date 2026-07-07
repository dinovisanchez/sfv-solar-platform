import type { Battery, Inverter, PVModule, Transformer } from "@/models/catalog";
import { CATALOG_DATA } from "@/services/catalog/mockData";
import type { GridType } from "@/models/electrical";

const TRANSFORMER_SAFETY_MARGIN = 1.25;

export type InverterRecommendation = {
  inverter: Inverter;
  dcAcRatio: number;
  reasons: string[];
};

export type BatteryRecommendation = {
  battery: Battery;
  unitsNeeded: number;
  totalUsableCapacityKwh: number;
  reasons: string[];
};

function phasesForGridType(gridType: GridType): 1 | 3 {
  return gridType === "trifasica" ? 3 : 1;
}

export function recommendPanel(preferredId?: string): PVModule {
  const panels = CATALOG_DATA.paneles as PVModule[];
  return panels.find((panel) => panel.id === preferredId) ?? panels[0];
}

export function recommendInverter(requiredDcKwp: number, gridType: GridType): InverterRecommendation | null {
  const targetPhases = phasesForGridType(gridType);
  const inverters = (CATALOG_DATA.inversores as Inverter[]).filter((inv) => inv.phases === targetPhases);
  const candidates = inverters.length > 0 ? inverters : (CATALOG_DATA.inversores as Inverter[]);
  if (candidates.length === 0) return null;

  const scored = candidates.map((inverter) => {
    const dcAcRatio = requiredDcKwp / inverter.acPowerKw;
    const distanceFromIdeal = Math.abs(dcAcRatio - 1.15);
    const outOfRangePenalty = dcAcRatio > 1.35 || dcAcRatio < 0.9 ? 10 : 0;
    return { inverter, dcAcRatio, score: distanceFromIdeal + outOfRangePenalty };
  });

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];

  const reasons = [
    `Relación DC/AC de ${best.dcAcRatio.toFixed(2)} con ${requiredDcKwp.toFixed(2)} kWp DC sobre ${best.inverter.acPowerKw} kW AC (rango recomendado 1.05–1.35 en on-grid).`,
    best.inverter.phases === targetPhases
      ? `Compatible con red ${targetPhases === 3 ? "trifásica" : "mono/bifásica"} del proyecto.`
      : `No hay inversor ${targetPhases === 3 ? "trifásico" : "monofásico"} en el catálogo actual; se muestra la mejor alternativa disponible.`,
    `Certificaciones: ${best.inverter.certifications.join(", ")}.`
  ];

  return { inverter: best.inverter, dcAcRatio: best.dcAcRatio, reasons };
}

export function recommendBattery(requiredCapacityKwh: number, requiredPowerKw: number): BatteryRecommendation | null {
  const batteries = CATALOG_DATA.baterias as Battery[];
  if (batteries.length === 0 || requiredCapacityKwh <= 0) return null;

  const scored = batteries.map((battery) => {
    const unitsForCapacity = Math.ceil(requiredCapacityKwh / battery.usableCapacityKwh);
    const unitsForPower = Math.ceil(requiredPowerKw / battery.maxContinuousPowerKw);
    const unitsNeeded = Math.max(1, unitsForCapacity, unitsForPower);
    const totalUsableCapacityKwh = unitsNeeded * battery.usableCapacityKwh;
    const oversizeKwh = totalUsableCapacityKwh - requiredCapacityKwh;
    return { battery, unitsNeeded, totalUsableCapacityKwh, oversizeKwh };
  });

  scored.sort((a, b) => a.oversizeKwh - b.oversizeKwh || a.unitsNeeded - b.unitsNeeded);
  const best = scored[0];

  const reasons = [
    `Requiere ${requiredCapacityKwh.toFixed(2)} kWh útiles; ${best.unitsNeeded} unidad(es) de ${best.battery.usableCapacityKwh} kWh dan ${best.totalUsableCapacityKwh.toFixed(2)} kWh útiles totales.`,
    `Potencia continua requerida ~${requiredPowerKw.toFixed(2)} kW, cubierta con ${best.unitsNeeded} unidad(es) de ${best.battery.maxContinuousPowerKw} kW cada una.`,
    `Química ${best.battery.chemistry}, eficiencia ida-vuelta ${(best.battery.roundTripEfficiency * 100).toFixed(0)}%.`
  ];

  return { battery: best.battery, unitsNeeded: best.unitsNeeded, totalUsableCapacityKwh: best.totalUsableCapacityKwh, reasons };
}

export type TransformerRecommendation = {
  transformer: Transformer;
  requiredKva: number;
  reasons: string[];
};

/**
 * Dimensionamiento simplificado: kVA requeridos = potencia AC * margen de
 * seguridad (arranque, futuras cargas). No reemplaza un estudio de carga
 * ni la coordinación de protecciones con el operador de red.
 */
export function recommendTransformer(requiredAcPowerKw: number, gridType: GridType): TransformerRecommendation | null {
  const targetPhases = phasesForGridType(gridType);
  const requiredKva = requiredAcPowerKw * TRANSFORMER_SAFETY_MARGIN;

  const transformers = (CATALOG_DATA.transformadores as Transformer[]).filter((t) => t.phases === targetPhases);
  const candidates = transformers.length > 0 ? transformers : (CATALOG_DATA.transformadores as Transformer[]);
  if (candidates.length === 0) return null;

  const scored = candidates.map((transformer) => ({
    transformer,
    oversizeKva: transformer.ratedPowerKva - requiredKva
  }));

  const covering = scored.filter((entry) => entry.oversizeKva >= 0).sort((a, b) => a.oversizeKva - b.oversizeKva);
  const best = covering[0] ?? scored.sort((a, b) => b.oversizeKva - a.oversizeKva)[0];

  const reasons = [
    `Potencia AC de ${requiredAcPowerKw.toFixed(2)} kW con margen de seguridad (${Math.round((TRANSFORMER_SAFETY_MARGIN - 1) * 100)}%) requiere ~${requiredKva.toFixed(1)} kVA.`,
    best.oversizeKva >= 0
      ? `El modelo de ${best.transformer.ratedPowerKva} kVA cubre el requerimiento con margen.`
      : `No hay un transformador del catálogo actual que cubra ${requiredKva.toFixed(1)} kVA; se muestra el de mayor capacidad disponible (${best.transformer.ratedPowerKva} kVA).`,
    `Tipo ${best.transformer.type}, ${best.transformer.primaryVoltageV / 1000} kV / ${best.transformer.secondaryVoltageV} V, ${best.transformer.phases === 3 ? "trifásico" : "monofásico"}.`
  ];

  return { transformer: best.transformer, requiredKva, reasons };
}
