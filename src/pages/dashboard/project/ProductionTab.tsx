import { EmptyState } from "@/components/ui/EmptyState";

export function ProductionTab() {
  return (
    <EmptyState
      title="Simulación de producción energética"
      description="Producción horaria/mensual con pérdidas, clipping y recurso solar real (NASA POWER / PVGIS / Open-Meteo). Ver ROADMAP.md, Fase 2 y 4."
    />
  );
}
