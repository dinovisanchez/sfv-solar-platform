export const SITE = {
  name: "sfv",
  fullName: "SFV Solar Platform",
  tagline: "Ingeniería fotovoltaica profesional para Colombia",
  description:
    "Diseña, simula y gestiona proyectos solares fotovoltaicos con un motor de cálculo de ingeniería, cumplimiento normativo y reportes listos para tu cliente."
};

export const NAV_LINKS = [
  { label: "Producto", href: "#modulos" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Planes", href: "#planes" },
  { label: "Preguntas frecuentes", href: "#faq" }
];

export const FEATURES = [
  {
    title: "Motor de cálculo de ingeniería",
    description:
      "Dimensionamiento de paneles, inversores y baterías con validación de strings, MPPT y relación DC/AC contra ficha técnica.",
    icon: "Calculator"
  },
  {
    title: "Cumplimiento normativo",
    description: "Reglas alineadas a RETIE, NTC 2050 y regulación CREG de generación distribuida en Colombia.",
    icon: "ShieldCheck"
  },
  {
    title: "Análisis financiero",
    description: "ROI, VPN, TIR y periodo de retorno calculados a partir de la producción estimada y la tarifa del cliente.",
    icon: "TrendingUp"
  },
  {
    title: "Reportes profesionales",
    description: "Memoria de cálculo, BOM y diagramas exportables a PDF y Excel para tu cliente y el operador de red.",
    icon: "FileText"
  },
  {
    title: "Catálogo de equipos",
    description: "Paneles, inversores, baterías, protecciones y conductores organizados por fabricante y ficha técnica.",
    icon: "PackageSearch"
  },
  {
    title: "Multiempresa desde el día uno",
    description: "Arquitectura preparada para múltiples organizaciones, roles, licencias y suscripciones.",
    icon: "Building2"
  }
] as const;

export const MODULES = [
  { title: "Dimensionador FV", description: "Consumo, cobertura objetivo, HSP y potencia real del arreglo." },
  { title: "Diseño eléctrico", description: "Strings, protecciones DC/AC, cableado y caída de tensión." },
  { title: "Producción energética", description: "Estimación mensual y anual con performance ratio configurable." },
  { title: "Financiero", description: "ROI, VPN, TIR y periodo de retorno del proyecto." },
  { title: "BOM y diagramas", description: "Lista de materiales y unifilar generados desde el propio diseño." },
  { title: "Instalación y O&M", description: "Checklist guiada de instalación, comisionamiento y mantenimiento." }
] as const;

export const PLANS = [
  {
    name: "Starter",
    price: "Gratis",
    description: "Para evaluar la plataforma con un proyecto activo.",
    features: ["1 proyecto activo", "Dimensionador FV", "Reportes básicos en PDF"],
    highlighted: false
  },
  {
    name: "Profesional",
    price: "Próximamente",
    description: "Para ingenieros e instaladores independientes.",
    features: [
      "Proyectos ilimitados",
      "Módulo financiero completo",
      "Catálogo de equipos",
      "Exportación a Excel"
    ],
    highlighted: true
  },
  {
    name: "Empresa",
    price: "A la medida",
    description: "Para empresas con varios equipos y clientes.",
    features: [
      "Multiempresa y roles",
      "Historial y versionado de proyectos",
      "API REST",
      "Soporte prioritario"
    ],
    highlighted: false
  }
] as const;

export const FAQS = [
  {
    question: "¿La plataforma reemplaza una memoria de cálculo firmada?",
    answer:
      "No. Es una herramienta de apoyo a la ingeniería. El diseño final debe ser revisado y firmado por un profesional competente cuando la normativa lo exija."
  },
  {
    question: "¿Los cálculos consideran RETIE y NTC 2050?",
    answer:
      "El motor de reglas está diseñado para validar contra RETIE, NTC 2050 y la regulación CREG aplicable. La biblioteca normativa se amplía de forma incremental."
  },
  {
    question: "¿Puedo usarla sin conexión a un backend?",
    answer:
      "Sí, en esta etapa los proyectos se guardan localmente en tu navegador. La arquitectura ya está preparada para sincronizar con una API REST cuando esté disponible."
  },
  {
    question: "¿Van a integrar mapas y datos climáticos reales?",
    answer:
      "Sí. La arquitectura ya contempla proveedores de mapas (Google Maps, OpenStreetMap, Mapbox) y de recurso solar (NASA POWER, PVGIS, Open-Meteo), listos para conectarse."
  }
] as const;
