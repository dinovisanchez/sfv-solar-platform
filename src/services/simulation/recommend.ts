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
    `Química ${best.battery.chemistry}, eficiencia ida-vuelta ${(best.battery.roundTripEfficiency * 100).toFixed(0)}%.`,
    best.unitsNeeded > 1
      ? `Las ${best.unitsNeeded} unidades se conectan en paralelo (mismo bus DC) para sumar capacidad y potencia, manteniendo el voltaje nominal del banco — verificar el límite de unidades en paralelo del manual del fabricante.`
      : "Módulos de este tipo se apilan en paralelo si más adelante se necesita ampliar la capacidad, manteniendo el mismo voltaje nominal."
  ];

  return { battery: best.battery, unitsNeeded: best.unitsNeeded, totalUsableCapacityKwh: best.totalUsableCapacityKwh, reasons };
}

export type StringConfiguration = {
  panelsPerString: number;
  numberOfStrings: number;
  vocCorrectedV: number;
  vmpStringV: number;
  vstringMaxV: number;
  currentPerMpptA: number;
  withinVoltageLimit: boolean;
  withinMpptRange: boolean;
  withinCurrentLimit: boolean;
  reasons: string[];
};

const DC_VOLTAGE_SAFETY_MARGIN = 0.97;
const ISC_SAFETY_FACTOR = 1.25;

/**
 * Paneles en serie por string y strings en paralelo hacia el inversor.
 * Formulas de Guia Practica SS6: Voc corregido por temperatura minima del
 * sitio no debe superar la tension maxima DC del inversor; Vmp del string
 * debe caer dentro del rango MPPT; la corriente combinada por entrada MPPT
 * (Isc con margen de seguridad) no debe superar el maximo admitido.
 */
export function recommendStringConfiguration(params: {
  panel: PVModule;
  inverter: Inverter;
  panelsNeeded: number;
  minSiteTempC: number;
}): StringConfiguration {
  const { panel, inverter, panelsNeeded, minSiteTempC } = params;

  const vocCorrectedV = panel.voc * (1 + panel.temperatureCoefficientVoc * (minSiteTempC - 25));
  const safeMaxDcVoltage = inverter.maxDcVoltage * DC_VOLTAGE_SAFETY_MARGIN;

  const maxBySeriesVoltage = Math.max(1, Math.floor(safeMaxDcVoltage / vocCorrectedV));
  const maxBySeriesMppt = Math.max(1, Math.floor(inverter.mpptRangeMax / panel.vmp));
  const minBySeriesMppt = Math.max(1, Math.ceil(inverter.mpptRangeMin / panel.vmp));

  const panelsPerString = Math.max(1, Math.min(maxBySeriesVoltage, maxBySeriesMppt));
  const withinMpptRange = panelsPerString >= minBySeriesMppt;
  const withinVoltageLimit = panelsPerString * vocCorrectedV <= inverter.maxDcVoltage;

  const numberOfStrings = Math.max(1, Math.ceil(panelsNeeded / panelsPerString));
  const vstringMaxV = panelsPerString * vocCorrectedV;
  const vmpStringV = panelsPerString * panel.vmp;

  const stringsPerMpptInput = Math.ceil(numberOfStrings / inverter.mpptCount);
  const currentPerMpptA = panel.isc * ISC_SAFETY_FACTOR * stringsPerMpptInput;
  const withinCurrentLimit = currentPerMpptA <= inverter.maxInputCurrentPerMppt;

  const reasons = [
    `Los paneles se conectan en serie dentro de cada string (para sumar tensión) y los strings en paralelo hacia el inversor (para sumar corriente).`,
    `Voc corregido a ${minSiteTempC}°C: ${vocCorrectedV.toFixed(1)} V. ${panelsPerString} paneles en serie dan ${vstringMaxV.toFixed(1)} V, ${withinVoltageLimit ? "dentro" : "por encima"} del límite de ${inverter.maxDcVoltage} V DC del inversor.`,
    `Vmp del string: ${vmpStringV.toFixed(1)} V, ${withinMpptRange ? "dentro" : "fuera"} del rango MPPT (${inverter.mpptRangeMin}–${inverter.mpptRangeMax} V).`,
    `${numberOfStrings} string(s) en paralelo (${stringsPerMpptInput} por entrada MPPT de ${inverter.mpptCount}) ≈ ${currentPerMpptA.toFixed(1)} A por MPPT, ${withinCurrentLimit ? "dentro" : "por encima"} del máximo de ${inverter.maxInputCurrentPerMppt} A.`
  ];

  return {
    panelsPerString,
    numberOfStrings,
    vocCorrectedV,
    vmpStringV,
    vstringMaxV,
    currentPerMpptA,
    withinVoltageLimit,
    withinMpptRange,
    withinCurrentLimit,
    reasons
  };
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

export type MeteringType = "directa" | "semidirecta" | "indirecta";

export type MeteringRecommendation = {
  type: MeteringType;
  meterLabel: string;
  estimatedCurrentA: number;
  reasons: string[];
};

const REFERENCE_AC_VOLTAGE = 220;
const DIRECT_METERING_CURRENT_LIMIT_A = 60;

/**
 * Regla general de referencia (no reemplaza el esquema de medida exigido
 * por el operador de red, que puede variar por corriente, tension o
 * politica propia): a mayor corriente o si hay transformador de por medio
 * (conexion en un nivel de tension distinto), se requieren transformadores
 * de instrumento (TC y/o TP) en vez de medicion directa.
 */
export function recommendMetering(params: {
  acPowerKw: number;
  gridType: GridType;
  hasTransformer: boolean;
}): MeteringRecommendation {
  const estimatedCurrentA =
    params.gridType === "trifasica"
      ? (params.acPowerKw * 1000) / (Math.sqrt(3) * REFERENCE_AC_VOLTAGE)
      : (params.acPowerKw * 1000) / REFERENCE_AC_VOLTAGE;

  let type: MeteringType;
  if (params.hasTransformer) {
    type = "indirecta";
  } else if (estimatedCurrentA > DIRECT_METERING_CURRENT_LIMIT_A) {
    type = "semidirecta";
  } else {
    type = "directa";
  }

  const meterLabel =
    type === "directa"
      ? "Medidor bidireccional de conexión directa"
      : type === "semidirecta"
        ? "Medidor bidireccional semidirecto (con transformadores de corriente)"
        : "Medidor bidireccional indirecto (con transformadores de corriente y de tensión)";

  const typeExplanation =
    type === "indirecta"
      ? "Con transformador de potencia de por medio, la medición típica es indirecta: transformadores de corriente (TC) y de tensión (TP) referidos al punto de medida."
      : type === "semidirecta"
        ? "Corriente por encima de lo que admite un medidor de conexión directa: medición semidirecta con transformadores de corriente (TC), tensión medida en forma directa."
        : "Corriente dentro del rango de un medidor de conexión directa, sin transformadores de instrumento.";

  const reasons = [
    `Corriente AC estimada ≈ ${estimatedCurrentA.toFixed(1)} A (${params.gridType === "trifasica" ? "trifásica" : "mono/bifásica"}, ${REFERENCE_AC_VOLTAGE} V de referencia).`,
    typeExplanation,
    "Medidor bidireccional (importación/exportación) recomendado para autogeneración con posible entrega de excedentes, según la clasificación CREG del proyecto.",
    "Regla general de referencia: el operador de red define el umbral y el esquema de medida exigido para cada caso; validar antes de especificar el equipo final."
  ];

  return { type, meterLabel, estimatedCurrentA, reasons };
}
