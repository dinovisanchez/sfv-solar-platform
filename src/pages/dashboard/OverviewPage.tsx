import { Link } from "react-router-dom";
import { BarChart2, FileStack, Layers, Users } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRepositoryList } from "@/hooks/useRepositoryList";
import { projectRepository } from "@/services/projects/projectRepository";
import { clientRepository } from "@/services/clients/clientRepository";
import { quoteRepository } from "@/services/quotes/quoteRepository";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/formatters";

export function OverviewPage() {
  const { user } = useAuth();
  const { items: projects } = useRepositoryList(projectRepository);
  const { items: clients } = useRepositoryList(clientRepository);
  const { items: quotes } = useRepositoryList(quoteRepository);

  const totalKwp = projects.length;
  const recentProjects = [...projects]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5);

  return (
    <DashboardPage title={`Hola, ${user?.name?.split(" ")[0] ?? "ingeniero"}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Proyectos activos" value={String(projects.length)} icon={Layers} />
        <StatCard label="Clientes" value={String(clients.length)} icon={Users} />
        <StatCard label="Cotizaciones" value={String(quotes.length)} icon={FileStack} />
        <StatCard label="Proyectos totales" value={String(totalKwp)} icon={BarChart2} />
      </div>

      <Card>
        <CardHeader>
          <p className="font-semibold">Proyectos recientes</p>
          <Link to={ROUTES.app.projects} className={buttonVariants("outline", "sm")}>
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <EmptyState
              title="Todavía no tienes proyectos"
              description="Crea tu primer proyecto para empezar a dimensionar un sistema fotovoltaico."
              action={
                <Link to={ROUTES.app.projects} className={buttonVariants("primary", "md")}>
                  Crear proyecto
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {recentProjects.map((project) => (
                <li key={project.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <Link to={ROUTES.app.project(project.id)} className="font-medium hover:underline">
                      {project.name}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {project.location.city || "Ciudad sin definir"} · {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <Badge tone="info">{project.status.replace("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
