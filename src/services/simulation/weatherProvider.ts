import type { SolarResourceProvider, SolarResourceProviderName } from "@/interfaces/weatherProvider";

/**
 * TODO(roadmap Fase 4): conectar NASA POWER, PVGIS y Open-Meteo para
 * reemplazar el HSP fijo del dimensionador por recurso solar real del sitio.
 */
function createUnimplementedProvider(name: SolarResourceProviderName): SolarResourceProvider {
  return {
    name,
    async getSolarResource() {
      throw new Error(`Proveedor de recurso solar "${name}" aún no está conectado.`);
    }
  };
}

export const solarResourceProviders: Record<SolarResourceProviderName, SolarResourceProvider> = {
  "nasa-power": createUnimplementedProvider("nasa-power"),
  pvgis: createUnimplementedProvider("pvgis"),
  "open-meteo": createUnimplementedProvider("open-meteo")
};
