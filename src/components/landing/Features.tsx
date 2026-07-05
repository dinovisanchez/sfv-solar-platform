import { Card } from "@/components/ui/Card";
import { FEATURES } from "@/config/site";
import { ICON_MAP } from "@/components/landing/iconMap";

export function Features() {
  return (
    <section id="caracteristicas" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif-display text-3xl sm:text-4xl">Todo lo que necesita un diseño profesional</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Un flujo de trabajo pensado para ingenieros e instaladores, no solo una calculadora.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = ICON_MAP[feature.icon];
          return (
            <Card
              key={feature.title}
              className="animate-fade-up p-6"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
