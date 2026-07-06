import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center text-white">
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <div className="relative">
          <h2 className="font-serif-display text-3xl sm:text-4xl">Diseña tu primer proyecto en minutos</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Sin cuenta, sin tarjeta. Abre el dashboard y prueba el dimensionador FV con tus propios datos de
            consumo.
          </p>
          <Link
            to={ROUTES.app.overview}
            className={`${buttonVariants("primary", "lg")} mt-7 bg-white text-slate-900 hover:bg-slate-100`}
          >
            Abrir el dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
