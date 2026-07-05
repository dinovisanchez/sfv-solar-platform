import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { PLANS } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

export function Pricing() {
  return (
    <section id="planes" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif-display text-3xl sm:text-4xl">Planes para cada etapa</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Empieza gratis y evoluciona hacia un equipo con múltiples proyectos y clientes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn("flex flex-col p-6", plan.highlighted && "ring-2 ring-brand-500")}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Más popular
              </span>
            )}
            <p className="font-semibold">{plan.name}</p>
            <p className="mt-2 text-2xl font-bold">{plan.price}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to={ROUTES.register}
              className={cn("mt-6 w-full", buttonVariants(plan.highlighted ? "primary" : "outline", "md"))}
            >
              Empezar
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
