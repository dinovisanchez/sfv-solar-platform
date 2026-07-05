export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN ?? "",
  appEnv: import.meta.env.MODE
};
