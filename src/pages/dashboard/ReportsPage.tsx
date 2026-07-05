import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { EmptyState } from "@/components/ui/EmptyState";

export function ReportsPage() {
  return (
    <DashboardPage title="Reportes">
      <EmptyState
        title="Los reportes viven dentro de cada proyecto"
        description="Entra a un proyecto y usa la pestaña 'Reportes' para generar memoria de cálculo, BOM y financiero en PDF/Excel. Un historial global se agregará en una fase posterior."
      />
    </DashboardPage>
  );
}
