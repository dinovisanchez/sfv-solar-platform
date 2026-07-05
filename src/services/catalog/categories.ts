import type { CatalogCategory, CatalogItem } from "@/models/catalog";

export type CatalogCategoryConfig = {
  slug: CatalogCategory;
  label: string;
  description: string;
  formatSpecs: (item: CatalogItem) => string;
};

function isPanel(item: CatalogItem): item is Extract<CatalogItem, { category: "paneles" }> {
  return item.category === "paneles";
}

function isInverter(item: CatalogItem): item is Extract<CatalogItem, { category: "inversores" }> {
  return item.category === "inversores";
}

function isBattery(item: CatalogItem): item is Extract<CatalogItem, { category: "baterias" }> {
  return item.category === "baterias";
}

export const CATALOG_CATEGORIES: CatalogCategoryConfig[] = [
  {
    slug: "paneles",
    label: "Paneles",
    description: "Módulos fotovoltaicos con ficha eléctrica STC.",
    formatSpecs: (item) => (isPanel(item) ? `${item.powerWatts} W · ${item.efficiency}% eficiencia` : "—")
  },
  {
    slug: "inversores",
    label: "Inversores",
    description: "Potencia AC, rango MPPT y número de fases.",
    formatSpecs: (item) =>
      isInverter(item) ? `${item.acPowerKw} kW AC · ${item.phases === 1 ? "monofásico" : "trifásico"}` : "—"
  },
  {
    slug: "baterias",
    label: "Baterías",
    description: "Capacidad usable y química por fabricante.",
    formatSpecs: (item) => (isBattery(item) ? `${item.usableCapacityKwh} kWh · ${item.chemistry}` : "—")
  },
  {
    slug: "controladores",
    label: "Controladores",
    description: "Controladores de carga para sistemas con batería.",
    formatSpecs: () => "—"
  },
  {
    slug: "dps",
    label: "DPS",
    description: "Dispositivos de protección contra sobretensiones.",
    formatSpecs: () => "—"
  },
  {
    slug: "breakers",
    label: "Breakers",
    description: "Interruptores automáticos DC/AC.",
    formatSpecs: () => "—"
  },
  {
    slug: "fusibles",
    label: "Fusibles",
    description: "Fusibles de string y protección de circuitos.",
    formatSpecs: () => "—"
  },
  {
    slug: "conductores",
    label: "Conductores",
    description: "Cable solar y conductores AC certificados.",
    formatSpecs: () => "—"
  },
  {
    slug: "estructuras",
    label: "Estructuras",
    description: "Sistemas de montaje para cubierta, piso y carport.",
    formatSpecs: () => "—"
  }
];
