import type { Battery, CatalogCategory, CatalogItem, Inverter, PVModule, Transformer } from "@/models/catalog";

const panels: PVModule[] = [
  {
    id: "panel-rec-430",
    manufacturerId: "mfr-rec",
    manufacturer: "REC",
    model: "Alpha Pure-R 430",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 430,
    voc: 45.4,
    isc: 12.2,
    vmp: 38.4,
    imp: 11.2,
    temperatureCoefficientVoc: -0.0024,
    efficiency: 22.3,
    dimensionsM: { width: 1.134, height: 1.821 },
    weightKg: 19.5
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
  },
  {
    id: "panel-ja-solar-585",
    manufacturerId: "mfr-ja-solar",
    manufacturer: "JA Solar",
    model: "DeepBlue 4.0 X 585",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 585,
    voc: 51.8,
    isc: 14.1,
    vmp: 43.3,
    imp: 13.52,
    temperatureCoefficientVoc: -0.0026,
    efficiency: 22.5,
    dimensionsM: { width: 1.134, height: 2.278 },
    weightKg: 28.8
  },
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
    id: "panel-trina-590",
    manufacturerId: "mfr-trina",
    manufacturer: "Trina Solar",
    model: "Vertex S+ 590",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 590,
    voc: 51.9,
    isc: 14.2,
    vmp: 43.4,
    imp: 13.6,
    temperatureCoefficientVoc: -0.0025,
    efficiency: 22.4,
    dimensionsM: { width: 1.134, height: 2.278 },
    weightKg: 29.7
  },
  {
    id: "panel-canadian-665",
    manufacturerId: "mfr-canadian",
    manufacturer: "Canadian Solar",
    model: "HiKu7 665",
    category: "paneles",
    certifications: ["IEC 61215", "IEC 61730"],
    powerWatts: 665,
    voc: 46.6,
    isc: 18.15,
    vmp: 38.9,
    imp: 17.09,
    temperatureCoefficientVoc: -0.0025,
    efficiency: 21.4,
    dimensionsM: { width: 1.303, height: 2.384 },
    weightKg: 34.6
  }
];

const inverters: Inverter[] = [
  {
    id: "inverter-goodwe-3kw",
    manufacturerId: "mfr-goodwe",
    manufacturer: "GoodWe",
    model: "GW3000-NS",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 3,
    maxDcVoltage: 600,
    mpptRangeMin: 100,
    mpptRangeMax: 550,
    maxInputCurrentPerMppt: 13.5,
    mpptCount: 1,
    phases: 1
  },
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
    id: "inverter-deye-8kw-hybrid",
    manufacturerId: "mfr-deye",
    manufacturer: "Deye",
    model: "SUN-8K-SG04LP3-EU (híbrido)",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 8,
    maxDcVoltage: 500,
    mpptRangeMin: 100,
    mpptRangeMax: 450,
    maxInputCurrentPerMppt: 13,
    mpptCount: 2,
    phases: 3
  },
  {
    id: "inverter-fronius-10kw",
    manufacturerId: "mfr-fronius",
    manufacturer: "Fronius",
    model: "Symo 10.0-3-M",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 10,
    maxDcVoltage: 1000,
    mpptRangeMin: 270,
    mpptRangeMax: 800,
    maxInputCurrentPerMppt: 18,
    mpptCount: 2,
    phases: 3
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
  },
  {
    id: "inverter-sungrow-20kw",
    manufacturerId: "mfr-sungrow",
    manufacturer: "Sungrow",
    model: "SG20RT",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 20,
    maxDcVoltage: 1100,
    mpptRangeMin: 200,
    mpptRangeMax: 1000,
    maxInputCurrentPerMppt: 26,
    mpptCount: 2,
    phases: 3
  },
  {
    id: "inverter-sma-25kw",
    manufacturerId: "mfr-sma",
    manufacturer: "SMA",
    model: "Sunny Tripower 25000TL",
    category: "inversores",
    certifications: ["IEC 62109"],
    acPowerKw: 25,
    maxDcVoltage: 1000,
    mpptRangeMin: 320,
    mpptRangeMax: 800,
    maxInputCurrentPerMppt: 33,
    mpptCount: 2,
    phases: 3
  }
];

const batteries: Battery[] = [
  {
    id: "battery-dyness-2500",
    manufacturerId: "mfr-dyness",
    manufacturer: "Dyness",
    model: "PowerCube PC25S",
    category: "baterias",
    certifications: ["UN38.3"],
    chemistry: "LFP",
    usableCapacityKwh: 2.5,
    maxContinuousPowerKw: 1.28,
    roundTripEfficiency: 0.93
  },
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
  },
  {
    id: "battery-byd-hvs-7-7",
    manufacturerId: "mfr-byd",
    manufacturer: "BYD",
    model: "Battery-Box Premium HVS 7.7",
    category: "baterias",
    certifications: ["UN38.3", "IEC 62619"],
    chemistry: "LFP",
    usableCapacityKwh: 7.68,
    maxContinuousPowerKw: 5.1,
    roundTripEfficiency: 0.96
  },
  {
    id: "battery-huawei-luna2000-10",
    manufacturerId: "mfr-huawei",
    manufacturer: "Huawei",
    model: "LUNA2000-10-S0",
    category: "baterias",
    certifications: ["UN38.3", "IEC 62619"],
    chemistry: "LFP",
    usableCapacityKwh: 10,
    maxContinuousPowerKw: 5,
    roundTripEfficiency: 0.96
  },
  {
    id: "battery-freedom-won-15",
    manufacturerId: "mfr-freedom-won",
    manufacturer: "Freedom Won",
    model: "Lite Power 15",
    category: "baterias",
    certifications: ["UN38.3"],
    chemistry: "LFP",
    usableCapacityKwh: 15,
    maxContinuousPowerKw: 7.5,
    roundTripEfficiency: 0.94
  }
];

const transformers: Transformer[] = [
  {
    id: "transformer-15kva-mono",
    manufacturerId: "mfr-abb",
    manufacturer: "ABB",
    model: "Distribución seca 15 kVA",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 15,
    primaryVoltageV: 13200,
    secondaryVoltageV: 240,
    phases: 1,
    type: "seco"
  },
  {
    id: "transformer-30kva-tri",
    manufacturerId: "mfr-abb",
    manufacturer: "ABB",
    model: "Distribución seca 30 kVA",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 30,
    primaryVoltageV: 13200,
    secondaryVoltageV: 220,
    phases: 3,
    type: "seco"
  },
  {
    id: "transformer-45kva-tri",
    manufacturerId: "mfr-siemens",
    manufacturer: "Siemens",
    model: "GEAFOL seco 45 kVA",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 45,
    primaryVoltageV: 13200,
    secondaryVoltageV: 440,
    phases: 3,
    type: "seco"
  },
  {
    id: "transformer-75kva-tri-oil",
    manufacturerId: "mfr-schneider",
    manufacturer: "Schneider Electric",
    model: "Minera++ 75 kVA en aceite",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 75,
    primaryVoltageV: 13200,
    secondaryVoltageV: 440,
    phases: 3,
    type: "aceite"
  },
  {
    id: "transformer-112-5kva-tri",
    manufacturerId: "mfr-eaton",
    manufacturer: "Eaton",
    model: "Cooper Power 112.5 kVA",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 112.5,
    primaryVoltageV: 13200,
    secondaryVoltageV: 440,
    phases: 3,
    type: "aceite"
  },
  {
    id: "transformer-150kva-tri",
    manufacturerId: "mfr-siemens",
    manufacturer: "Siemens",
    model: "GEAFOL seco 150 kVA",
    category: "transformadores",
    certifications: ["IEC 60076", "RETIE"],
    ratedPowerKva: 150,
    primaryVoltageV: 13200,
    secondaryVoltageV: 440,
    phases: 3,
    type: "seco"
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
    id: "controller-victron-150-60",
    manufacturerId: "mfr-victron",
    manufacturer: "Victron Energy",
    model: "SmartSolar MPPT 150/60",
    category: "controladores",
    certifications: ["CE"]
  },
  {
    id: "controller-epever-triron",
    manufacturerId: "mfr-epever",
    manufacturer: "EPever",
    model: "Triron 4415N",
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
    id: "dps-abb-ac-t2",
    manufacturerId: "mfr-abb",
    manufacturer: "ABB",
    model: "OVR T2 3N-40-275",
    category: "dps",
    certifications: ["IEC 61643"]
  },
  {
    id: "dps-phoenix-contact-dc",
    manufacturerId: "mfr-phoenix",
    manufacturer: "Phoenix Contact",
    model: "VAL-MS 1000DC-PV",
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
    id: "breaker-chint-ac",
    manufacturerId: "mfr-chint",
    manufacturer: "Chint",
    model: "NXB-63 AC",
    category: "breakers",
    certifications: ["IEC 60947"]
  },
  {
    id: "breaker-abb-tmax",
    manufacturerId: "mfr-abb",
    manufacturer: "ABB",
    model: "Tmax XT1 160",
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
    id: "fuse-littelfuse-20a",
    manufacturerId: "mfr-littelfuse",
    manufacturer: "Littelfuse",
    model: "CMC 20A gPV",
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
    id: "conductor-pv1f-10mm",
    manufacturerId: "mfr-generic",
    manufacturer: "Genérico certificado",
    model: "PV1-F 10mm²",
    category: "conductores",
    certifications: ["EN 50618"]
  },
  {
    id: "conductor-thhn-8awg",
    manufacturerId: "mfr-centelsa",
    manufacturer: "Centelsa",
    model: "THHN/THWN-2 8 AWG",
    category: "conductores",
    certifications: ["NTC 2050"]
  },
  {
    id: "structure-schletter-rail",
    manufacturerId: "mfr-schletter",
    manufacturer: "Schletter",
    model: "Rail System FS (cubierta)",
    category: "estructuras",
    certifications: ["EN 1090"]
  },
  {
    id: "structure-esdec-clickfit",
    manufacturerId: "mfr-esdec",
    manufacturer: "Esdec",
    model: "ClickFit EVO (teja)",
    category: "estructuras",
    certifications: ["EN 1090"]
  },
  {
    id: "structure-ground-mount",
    manufacturerId: "mfr-generic",
    manufacturer: "Genérico certificado",
    model: "Estructura fija a nivel de piso",
    category: "estructuras",
    certifications: ["EN 1090"]
  }
];

export const CATALOG_DATA: Record<CatalogCategory, CatalogItem[]> = {
  paneles: panels,
  inversores: inverters,
  baterias: batteries,
  transformadores: transformers,
  controladores: others.filter((item) => item.category === "controladores"),
  dps: others.filter((item) => item.category === "dps"),
  breakers: others.filter((item) => item.category === "breakers"),
  fusibles: others.filter((item) => item.category === "fusibles"),
  conductores: others.filter((item) => item.category === "conductores"),
  estructuras: others.filter((item) => item.category === "estructuras")
};
