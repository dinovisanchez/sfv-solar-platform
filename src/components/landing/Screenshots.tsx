import { BarChart2, FileStack, Layers, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

const sparkline = [8, 14, 10, 18, 22, 16, 26, 30, 24, 34, 28, 38];

export function Screenshots() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif-display text-3xl sm:text-4xl">Un dashboard hecho para el día a día</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Así se ve tu panel de proyectos, sin capturas de pantalla estáticas de un producto ajeno.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-4xl overflow-hidden p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
          <p className="text-sm font-semibold">Resumen del portafolio</p>
          <Badge tone="info">Vista previa</Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Proyectos activos" value="18" icon={Layers} trend="+3 este mes" trendTone="up" />
          <StatCard label="Clientes" value="42" icon={Users} trend="+5 este mes" trendTone="up" />
          <StatCard label="Cotizaciones" value="9" icon={FileStack} trend="2 pendientes" trendTone="neutral" />
          <StatCard label="kWp diseñados" value="512" icon={BarChart2} trend="+38 kWp" trendTone="up" />
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-white/5">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Producción estimada (kWh/mes)</p>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {sparkline.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-solar-400"
                style={{ height: `${height * 2.4}px` }}
              />
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
