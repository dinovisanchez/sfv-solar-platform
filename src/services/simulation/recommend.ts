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
  installedCapacityKva: number;
  accuracyClass: string;
  reasons: string[];
};

export const REFERENCE_AC_VOLTAGE = 220;
const ASSUMED_POWER_FACTOR = 0.9;
/**
 * Aproximacion de "X" (Tabla 5, RA8-030 / NTC 5019-2018): la norma no fija un
 * kVA universal, depende de la corriente maxima del medidor de conexion
 * directa disponible (Tabla 6 exige Imax >= 60 A). A 220 V esto equivale a
 * ~13 kVA monofasico; se usa 15 kVA como referencia conservadora, editable
 * por el operador de red segun el medidor que realmente instale.
 */
const DIRECT_METERING_MAX_KVA = 15;
const SEMIDIRECTA_MAX_KVA_AT_BT = 100;

/**
 * Basado en la Tabla 5 "Seleccion de los medidores de energia" (RA8-030,
 * norma tecnica del Grupo EPM/ESSA/EDEQ/CENS/CHEC basada en NTC 5019-2018 y
 * en el Codigo de Medida, Resolucion CREG 038 de 2014): el tipo de medicion
 * depende del nivel de tension (BT vs. MT/AT) y de la capacidad instalada
 * en kVA en el punto de conexion, no de un umbral de corriente aislado.
 *
 * - BT, CI <= X (~Imax del medidor de conexion directa): medicion directa.
 * - BT, X < CI < 100 kVA: medicion semidirecta (TC, tension directa).
 * - MT o AT (conexion a traves de un transformador de potencia — el punto de
 *   medida se ubica en el lado de alta tension del transformador segun
 *   RA8-030 numeral 6.8.a) o CI >= 100 kVA: medicion indirecta (TC + TP).
 *
 * Esto sigue siendo una referencia: el operador de red aplica su propia
 * norma tecnica (equivalente a RA8-030) y puede exigir un esquema distinto.
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

  const installedCapacityKva = params.acPowerKw / ASSUMED_POWER_FACTOR;
  const nivelTension = params.hasTransformer ? "MT/AT" : "BT";

  let type: MeteringType;
  if (nivelTension === "MT/AT" || installedCapacityKva >= SEMIDIRECTA_MAX_KVA_AT_BT) {
    type = "indirecta";
  } else if (installedCapacityKva > DIRECT_METERING_MAX_KVA) {
    type = "semidirecta";
  } else {
    type = "directa";
  }

  const accuracyClass = type === "directa" ? "1 activa / 2 reactiva" : installedCapacityKva >= 30000 ? "0,2S activa / 2 reactiva" : "0,5S activa / 2 reactiva";

  const meterLabel =
    type === "directa"
      ? "Medidor bidireccional de conexión directa"
      : type === "semidirecta"
        ? "Medidor bidireccional semidirecto (con transformadores de corriente TC)"
        : "Medidor bidireccional indirecto (con transformadores de corriente TC y de tensión TP)";

  const typeExplanation =
    type === "indirecta"
      ? nivelTension === "MT/AT"
        ? "Conexión a través de un transformador de potencia: el punto de medida se ubica en el lado de alta tensión del transformador (RA8-030 §6.8.a) y requiere TC y TP."
        : "Capacidad instalada ≥100 kVA: aunque la conexión sea en BT, a este tamaño típicamente se requiere transformador propio y medición indirecta."
      : type === "semidirecta"
        ? `Capacidad instalada de ${installedCapacityKva.toFixed(1)} kVA en BT, por encima de lo que cubre un medidor de conexión directa (~${DIRECT_METERING_MAX_KVA} kVA de referencia): medición semidirecta con TC, tensión medida en forma directa.`
        : `Capacidad instalada de ${installedCapacityKva.toFixed(1)} kVA en BT, dentro del rango de un medidor de conexión directa, sin transformadores de instrumento.`;

  const reasons = [
    `Capacidad instalada aproximada: ${installedCapacityKva.toFixed(1)} kVA (potencia AC del inversor ÷ factor de potencia ${ASSUMED_POWER_FACTOR}), nivel de tensión ${nivelTension}.`,
    typeExplanation,
    `Clase de exactitud de referencia: ${accuracyClass} (Tabla 2/5, Resolución CREG 038 de 2014 / NTC 5019-2018).`,
    "Medidor bidireccional (importación/exportación) recomendado para autogeneración con entrega de excedentes, con perfil horario según CREG 015 de 2018 si aplica mercado no regulado.",
    "Referencia basada en la Tabla 5 de la norma técnica RA8-030 (Grupo EPM/ESSA/EDEQ/CENS/CHEC, con base en NTC 5019-2018 y la Resolución CREG 038 de 2014); cada operador de red aplica su propia norma equivalente — validar antes de especificar el equipo final."
  ];

  return { type, meterLabel, estimatedCurrentA, installedCapacityKva, accuracyClass, reasons };
}
