import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useRepositoryList } from "@/hooks/useRepositoryList";
import { projectRepository } from "@/services/projects/projectRepository";
import { clientRepository } from "@/services/clients/clientRepository";
import { createEmptyProject } from "@/models/project";
import { createEmptyClient } from "@/models/client";
import type { Project } from "@/models/project";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/formatters";

const ORGANIZATION_ID = "org-demo";

export function ProjectsListPage() {
  const { items: projects, create } = useRepositoryList(projectRepository);
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateProject() {
    setIsCreating(true);
    const client = createEmptyClient(ORGANIZATION_ID, "Cliente nuevo");
    await clientRepository.create(client);
    const project = createEmptyProject({
      organizationId: ORGANIZATION_ID,
      clientId: client.id,
      name: `Proyecto ${projects.length + 1}`
    });
    await create(project);
    setIsCreating(false);
    navigate(ROUTES.app.project(project.id));
  }

  const columns: Column<Project>[] = [
    {
      header: "Proyecto",
      accessor: (project) => (
        <button className="font-medium hover:underline" onClick={() => navigate(ROUTES.app.project(project.id))}>
          {project.name}
        </button>
      )
    },
    { header: "Ciudad", accessor: (project) => project.location.city || "—" },
    { header: "Tipo", accessor: (project) => project.projectType },
    {
      header: "Estado",
      accessor: (project) => <Badge tone="info">{project.status.replace("_", " ")}</Badge>
    },
    { header: "Actualizado", accessor: (project) => formatDate(project.updatedAt) }
  ];

  return (
    <DashboardPage
      title="Mis proyectos"
      actions={
        <Button onClick={handleCreateProject} disabled={isCreating}>
          <Plus className="h-4 w-4" /> Nuevo proyecto
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={projects}
        rowKey={(project) => project.id}
        emptyMessage="Crea tu primer proyecto para empezar a dimensionar un sistema fotovoltaico."
      />
    </DashboardPage>
  );
}
