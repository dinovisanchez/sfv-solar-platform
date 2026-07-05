import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { Plan, Subscription } from "@/interfaces/subscription";

const currentPlan: Plan = {
  id: "plan-starter",
  tier: "starter",
  name: "Starter",
  maxProjects: 1,
  maxUsers: 1,
  features: ["Dimensionador FV", "Reportes básicos en PDF"]
};

const currentSubscription: Subscription = {
  id: "sub-demo",
  organizationId: "org-demo",
  planId: currentPlan.id,
  status: "en_prueba",
  currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export function SettingsPage() {
  return (
    <DashboardPage title="Configuración">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="font-semibold">Organización</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Nombre de la organización" name="organizationName" defaultValue="Mi empresa solar" />
            <Input label="País" name="country" defaultValue="Colombia" disabled />
            <p className="text-xs text-slate-400">
              La gestión completa de organización, miembros y roles llega con el backend multiempresa (ver
              ARCHITECTURE.md).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="font-semibold">Plan y suscripción</p>
            <Badge tone={currentSubscription.status === "activa" ? "success" : "warning"}>
              {currentSubscription.status.replace("_", " ")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-semibold">{currentPlan.name}</p>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              {currentPlan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-400">
              Proyectos: {currentPlan.maxProjects ?? "ilimitados"} · Usuarios: {currentPlan.maxUsers ?? "ilimitados"}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  );
}
