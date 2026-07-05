import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PROJECT_TABS, ROUTES, type ProjectTabSlug } from "@/constants/routes";
import { projectRepository } from "@/services/projects/projectRepository";
import type { Project } from "@/models/project";
import { GeneralTab } from "@/pages/dashboard/project/GeneralTab";
import { DimensioningTab } from "@/pages/dashboard/project/DimensioningTab";
import { ProductionTab } from "@/pages/dashboard/project/ProductionTab";
import { ElectricalTab } from "@/pages/dashboard/project/ElectricalTab";
import { FinancialTab } from "@/pages/dashboard/project/FinancialTab";
import { BOMTab } from "@/pages/dashboard/project/BOMTab";
import { DiagramsTab } from "@/pages/dashboard/project/DiagramsTab";
import { ReportsTab } from "@/pages/dashboard/project/ReportsTab";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as ProjectTabSlug | null) ?? "general";

  useEffect(() => {
    if (!projectId) return;
    projectRepository.get(projectId).then(setProject);
  }, [projectId]);

  if (project === undefined) {
    return <DashboardPage title="Cargando proyecto…">{null}</DashboardPage>;
  }

  if (project === null) {
    return (
      <DashboardPage title="Proyecto no encontrado">
        <EmptyState
          title="No encontramos este proyecto"
          description="Puede que haya sido eliminado o el enlace sea incorrecto."
        />
      </DashboardPage>
    );
  }

  async function handleSave(patch: Partial<Project>) {
    if (!project) return;
    const updated = await projectRepository.update(project.id, { ...patch, updatedAt: new Date().toISOString() });
    setProject(updated);
  }

  return (
    <DashboardPage title={project.name}>
      <Tabs
        items={PROJECT_TABS}
        active={activeTab}
        onChange={(slug) => setSearchParams({ tab: slug })}
        className="mb-1 w-full sm:w-fit"
      />

      {activeTab === "general" && <GeneralTab project={project} onSave={handleSave} />}
      {activeTab === "dimensionamiento" && <DimensioningTab />}
      {activeTab === "produccion" && <ProductionTab />}
      {activeTab === "electrico" && <ElectricalTab />}
      {activeTab === "financiero" && <FinancialTab />}
      {activeTab === "bom" && <BOMTab />}
      {activeTab === "diagramas" && <DiagramsTab />}
      {activeTab === "reportes" && <ReportsTab />}

      <button
        type="button"
        className="text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        onClick={() => navigate(ROUTES.app.projects)}
      >
        ← Volver a proyectos
      </button>
    </DashboardPage>
  );
}
