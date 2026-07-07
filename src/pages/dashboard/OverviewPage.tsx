import { Link } from "react-router-dom";
import { BatteryCharging, Bot, PackageSearch, PanelTop, Sparkles, Zap } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { buttonVariants } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { CATALOG_DATA } from "@/services/catalog/mockData";

export function OverviewPage() {
  const { user } = useAuth();

  const totalCatalogItems = Object.values(CATALOG_DATA).reduce((total, items) => total + items.length, 0);

  return (
    <DashboardPage title={`Hola, ${user?.name?.split(" ")[0] ?? "ingeniero"}`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paneles en catálogo" value={String(CATALOG_DATA.paneles.length)} icon={PanelTop} />
        <StatCard label="Inversores en catálogo" value={String(CATALOG_DATA.inversores.length)} icon={Zap} />
        <StatCard label="Baterías en catálogo" value={String(CATALOG_DATA.baterias.length)} icon={BatteryCharging} />
        <StatCard label="Equipos totales" value={String(totalCatalogItems)} icon={PackageSearch} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="mt-4 font-semibold">Simulación</p>
          <p className="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400">
            Ingresa el consumo, la ciudad y el techo o patio disponible: te recomendamos paneles, inversor,
            batería y transformador reales, con el plano del arreglo.
          </p>
          <Link to={ROUTES.app.simulation} className={`${buttonVariants("primary", "md")} mt-5 w-full`}>
            Empezar simulación
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
            <Bot className="h-5 w-5" />
          </span>
          <p className="mt-4 font-semibold">Asistente IA</p>
          <p className="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400">
            Pregunta lo que necesites sobre diseño, componentes, normativa o instalación. Responde citando el
            Manual Maestro y la Guía Práctica.
          </p>
          <Link to={ROUTES.app.assistant} className={`${buttonVariants("outline", "md")} mt-5 w-full`}>
            Abrir el asistente
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
            <PackageSearch className="h-5 w-5" />
          </span>
          <p className="mt-4 font-semibold">Catálogo de equipos</p>
          <p className="mt-1.5 flex-1 text-sm text-slate-500 dark:text-slate-400">
            Paneles, inversores, baterías, transformadores, protecciones, conductores y estructuras
            organizados por fabricante.
          </p>
          <Link to={ROUTES.app.catalog()} className={`${buttonVariants("outline", "md")} mt-5 w-full`}>
            Explorar catálogo
          </Link>
        </Card>
      </div>
    </DashboardPage>
  );
}
