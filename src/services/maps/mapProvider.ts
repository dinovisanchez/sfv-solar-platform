import type { MapProvider, MapProviderName } from "@/interfaces/mapProvider";

/**
 * TODO(roadmap Fase 4): implementar geocodificación real. Google Maps
 * requiere VITE_GOOGLE_MAPS_API_KEY, Mapbox requiere VITE_MAPBOX_TOKEN;
 * OpenStreetMap (Nominatim) no requiere llave pero tiene límites de uso.
 */
function createUnimplementedMapProvider(name: MapProviderName): MapProvider {
  return {
    name,
    async geocode() {
      throw new Error(`Proveedor de mapas "${name}" aún no está conectado.`);
    },
    async reverseGeocode() {
      throw new Error(`Proveedor de mapas "${name}" aún no está conectado.`);
    }
  };
}

export const mapProviders: Record<MapProviderName, MapProvider> = {
  "google-maps": createUnimplementedMapProvider("google-maps"),
  openstreetmap: createUnimplementedMapProvider("openstreetmap"),
  mapbox: createUnimplementedMapProvider("mapbox")
};
