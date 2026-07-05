export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export type GeocodeResult = GeoPoint & {
  formattedAddress: string;
};

export type MapProviderName = "google-maps" | "openstreetmap" | "mapbox";

export interface MapProvider {
  readonly name: MapProviderName;
  geocode(address: string): Promise<GeocodeResult>;
  reverseGeocode(point: GeoPoint): Promise<GeocodeResult>;
}
