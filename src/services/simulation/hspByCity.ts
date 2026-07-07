export type CityHsp = {
  city: string;
  department: string;
  hsp: number;
};

/**
 * Valores de referencia aproximados (promedio anual, HSP/día), NO una medición
 * satelital ni de estación. Sirven como default editable mientras no se conecta
 * un SolarResourceProvider real (NASA POWER / PVGIS / Open-Meteo, ver
 * src/services/simulation/weatherProvider.ts). El usuario siempre puede
 * sobrescribir el valor si conoce el dato real del sitio.
 */
export const HSP_BY_CITY: CityHsp[] = [
  { city: "Riohacha", department: "La Guajira", hsp: 6.0 },
  { city: "Santa Marta", department: "Magdalena", hsp: 5.7 },
  { city: "Valledupar", department: "Cesar", hsp: 5.6 },
  { city: "Barranquilla", department: "Atlántico", hsp: 5.5 },
  { city: "Cartagena", department: "Bolívar", hsp: 5.5 },
  { city: "Montería", department: "Córdoba", hsp: 5.0 },
  { city: "Cúcuta", department: "Norte de Santander", hsp: 5.0 },
  { city: "Neiva", department: "Huila", hsp: 4.9 },
  { city: "Ibagué", department: "Tolima", hsp: 4.7 },
  { city: "Villavicencio", department: "Meta", hsp: 4.5 },
  { city: "Cali", department: "Valle del Cauca", hsp: 4.5 },
  { city: "Bucaramanga", department: "Santander", hsp: 4.5 },
  { city: "Medellín", department: "Antioquia", hsp: 4.3 },
  { city: "Pereira", department: "Risaralda", hsp: 4.2 },
  { city: "Manizales", department: "Caldas", hsp: 4.0 },
  { city: "Bogotá", department: "Cundinamarca", hsp: 4.0 },
  { city: "Pasto", department: "Nariño", hsp: 4.0 }
];

export function getHspForCity(city: string): number | null {
  const match = HSP_BY_CITY.find((entry) => entry.city.toLowerCase() === city.trim().toLowerCase());
  return match?.hsp ?? null;
}
