import { Link } from "react-router-dom";
import { ArrowRight, Gauge, PanelTop, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/config/site";

export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:pt-24">
      <div className="animate-fade-up lg:col-span-7">
        <Badge tone="info" className="mb-5">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Nuevo: motor de dimensionamiento FV
        </Badge>
        <h1 className="font-serif-display text-[42px] leading-[1.05] tracking-tight sm:text-[56px] lg:text-[64px]">
          Ingeniería solar fotovoltaica,{" "}
          <span className="gradient-text">de la propuesta al comisionamiento.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">{SITE.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to={ROUTES.app.overview} className={buttonVariants("primary", "lg")}>
            Abrir el dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#asistente" className={buttonVariants("outline", "lg")}>
            Preguntarle al asistente IA
          </a>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Acceso libre, sin crear cuenta. Diseñado para ingenieros e instaladores en Colombia.
        </p>
      </div>

      <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: "0.1s" }}>
        <Card glass className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.35),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.25),transparent_35%)]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                  <PanelTop className="h-4 w-4" />
                </span>
                <p className="font-semibold">Residencial On-Grid</p>
              </div>
              <Badge tone="success">MVP validado</Badge>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                <p className="text-2xl font-bold">6.71</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">kWp DC</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                <p className="text-2xl font-bold">11</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Paneles</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                <p className="text-2xl font-bold">1.12</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">DC/AC</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/70 p-4 dark:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <Gauge className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">92% de cobertura estimada</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculado en tiempo real con tu consumo y HSP del sitio
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
