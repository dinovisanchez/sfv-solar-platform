import type { GeoPoint } from "@/interfaces/mapProvider";

export type SolarResourceProviderName = "nasa-power" | "pvgis" | "open-meteo";

export type SolarResourceSummary = {
  averageDailyHsp: number;
  monthlyHsp: number[];
  source: SolarResourceProviderName;
};

export interface SolarResourceProvider {
  readonly name: SolarResourceProviderName;
  getSolarResource(point: GeoPoint): Promise<SolarResourceSummary>;
}
