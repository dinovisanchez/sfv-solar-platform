import type { Battery, CatalogCategory, CatalogItem, Inverter, PVModule } from "@/models/catalog";

const panels: PVModule[] = [
  {
    id: "panel-longi-610",
    manufacturerId: "mfr-longi",
    manufacturer: "LONGi",
    model: "LR5-72HTH-610M",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 610,
    voc: 52.0,
    isc: 14.5,
    vmp: 43.7,
    imp: 13.96,
    temperatureCoefficientVoc: -0.0025,
    efficiency: 22.3,
    dimensionsM: { width: 1.134, height: 2.278 },
    weightKg: 32.8
  },
  {
    id: "panel-jinko-580",
    manufacturerId: "mfr-jinko",
    manufacturer: "Jinko Solar",
    model: "Tiger Neo N-type 580",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 580,
    voc: 51.3,
    isc: 14.0,
    vmp: 43.0,
    imp: 13.5,
    temperatureCoefficientVoc: -0.0024,
    efficiency: 22.5,
    dimensionsM: { width: 1.134, height: 2.278 },
    weightKg: 28.6
  }
];

const inverters: Inverter[] = [
  {
    id: "inverter-huawei-6ktl",
    manufacturerId: "mfr-huawei",
    manufacturer: "Huawei",
    model: "SUN2000-6KTL-L1",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 6,
    maxDcVoltage: 600,
    mpptRangeMin: 140,
    mpptRangeMax: 560,
    maxInputCurrentPerMppt: 13.5,
    mpptCount: 2,
    phases: 1
  },
  {
    id: "inverter-growatt-8ktl3",
    manufacturerId: "mfr-growatt",
    manufacturer: "Growatt",
    model: "MOD 8KTL3-X",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 8,
    maxDcVoltage: 1000,
    mpptRangeMin: 160,
    mpptRangeMax: 950,
    maxInputCurrentPerMppt: 16,
    mpptCount: 2,
    phases: 3
  }
];

const batteries: Battery[] = [
  {
    id: "battery-pylontech-us5000",
    manufacturerId: "mfr-pylontech",
    manufacturer: "Pylontech",
    model: "US5000",
    category: "baterias",
    certifications: ["UN38.3"],
    chemistry: "LFP",
    usableCapacityKwh: 4.8,
    maxContinuousPowerKw: 2.4,
    roundTripEfficiency: 0.95
  }
];

const others: CatalogItem[] = [
  {
    id: "controller-victron-100-30",
    manufacturerId: "mfr-victron",
    manufacturer: "Victron Energy",
    model: "SmartSolar MPPT 100/30",
    category: "controladores",
    certifications: ["CE"]
  },
  {
    id: "dps-dehn-dc-1000",
    manufacturerId: "mfr-dehn",
    manufacturer: "DEHN",
    model: "DEHNguard DC 1000",
    category: "dps",
    certifications: ["IEC 61643"]
  },
  {
    id: "breaker-schneider-dc",
    manufacturerId: "mfr-schneider",
    manufacturer: "Schneider Electric",
    model: "Acti9 iC60 DC",
    category: "breakers",
    certifications: ["IEC 60947"]
  },
  {
    id: "fuse-mersen-15a",
    manufacturerId: "mfr-mersen",
    manufacturer: "Mersen",
    model: "PV Fuse 15A gPV",
    category: "fusibles",
    certifications: ["IEC 60269"]
  },
  {
    id: "conductor-pv1f-6mm",
    manufacturerId: "mfr-generic",
    manufacturer: "Genérico certificado",
    model: "PV1-F 6mm²",
    category: "conductores",
    certifications: ["EN 50618"]
  },
  {
    id: "structure-schletter-rail",
    manufacturerId: "mfr-schletter",
    manufacturer: "Schletter",
    model: "Rail System FS",
    category: "estructuras",
    certifications: ["EN 1090"]
  }
];

export const CATALOG_DATA: Record<CatalogCategory, CatalogItem[]> = {
  paneles: panels,
  inversores: inverters,
  baterias: batteries,
  controladores: others.filter((item) => item.category === "controladores"),
  dps: others.filter((item) => item.category === "dps"),
  breakers: others.filter((item) => item.category === "breakers"),
  fusibles: others.filter((item) => item.category === "fusibles"),
  conductores: others.filter((item) => item.category === "conductores"),
  estructuras: others.filter((item) => item.category === "estructuras")
};
