import { Card } from "@/components/ui/Card";
import { MODULES } from "@/config/site";

export function Modules() {
  return (
    <section id="modulos" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-4">
          <h2 className="font-serif-display text-3xl sm:text-4xl">Un módulo por cada etapa del proyecto</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Desde el dimensionamiento preliminar hasta la instalación guiada y el mantenimiento, en una sola
            plataforma.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {MODULES.map((module) => (
            <Card key={module.title} className="p-5">
              <p className="font-semibold">{module.title}</p>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
