import { MapPin } from "lucide-react";

type MapPreviewPlaceholderProps = {
  latitude?: number;
  longitude?: number;
};

/**
 * Marcador visual de dónde se integrará un MapProvider real
 * (Google Maps / OpenStreetMap / Mapbox, ver src/interfaces/mapProvider.ts).
 */
export function MapPreviewPlaceholder({ latitude, longitude }: MapPreviewPlaceholderProps) {
  const hasCoordinates = latitude !== undefined && longitude !== undefined;

  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center dark:border-white/10 dark:bg-white/5">
      <MapPin className="h-5 w-5 text-slate-400" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {hasCoordinates ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : "Sin coordenadas todavía"}
      </p>
      <p className="text-xs text-slate-400">Mapa interactivo próximamente (Google Maps / OSM / Mapbox)</p>
    </div>
  );
}
