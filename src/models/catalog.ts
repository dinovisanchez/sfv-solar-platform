import type { Id } from "@/types/common";

export type CatalogCategory =
  | "paneles"
  | "inversores"
  | "baterias"
  | "transformadores"
  | "controladores"
  | "dps"
  | "breakers"
  | "fusibles"
  | "conductores"
  | "estructuras";

export type Manufacturer = {
  id: Id;
  name: string;
  country?: string;
  website?: string;
};

export type CatalogItemBase = {
  id: Id;
  manufacturerId: Id;
  manufacturer: string;
  model: string;
  category: CatalogCategory;
  certifications: string[];
  datasheetUrl?: string;
};

export type PVModule = CatalogItemBase & {
  category: "paneles";
  powerWatts: number;
  voc: number;
  isc: number;
  vmp: number;
  imp: number;
  temperatureCoefficientVoc: number;
  efficiency: number;
  /** Dimensiones físicas del módulo en metros, orientación de fábrica (portrait). */
  dimensionsM: { width: number; height: number };
  weightKg: number;
};

export type Inverter = CatalogItemBase & {
  category: "inversores";
  acPowerKw: number;
  maxDcVoltage: number;
  mpptRangeMin: number;
  mpptRangeMax: number;
  maxInputCurrentPerMppt: number;
  mpptCount: number;
  phases: 1 | 3;
};

export type Battery = CatalogItemBase & {
  category: "baterias";
  chemistry: "LFP" | "NMC" | "AGM" | "GEL" | "OPzV" | "OPzS";
  usableCapacityKwh: number;
  maxContinuousPowerKw: number;
  roundTripEfficiency: number;
};

export type Transformer = CatalogItemBase & {
  category: "transformadores";
  ratedPowerKva: number;
  primaryVoltageV: number;
  secondaryVoltageV: number;
  phases: 1 | 3;
  type: "seco" | "aceite";
};

export type CatalogItem =
  | PVModule
  | Inverter
  | Battery
  | Transformer
  | (CatalogItemBase & {
      category: Exclude<CatalogCategory, "paneles" | "inversores" | "baterias" | "transformadores">;
    });
