import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/constants/routes";

export function AssistantSection() {
  return (
    <section id="asistente" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Badge tone="info" className="mb-4">
            Prueba real, no una maqueta
          </Badge>
          <h2 className="font-serif-display text-3xl sm:text-4xl">
            Un asistente que conoce tu manual de ingeniería
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Este chat funciona ahora mismo, aquí en la landing: busca directamente en el Manual Maestro y la
            Guía Práctica del proyecto y responde citando la sección exacta. No usa un modelo de lenguaje
            externo ni inventa normativa — si el documento no lo dice, te lo avisa.
          </p>
          <Link to={ROUTES.app.assistant} className={`${buttonVariants("outline", "md")} mt-6`}>
            Abrir el asistente en el dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <AssistantChat variant="compact" />
        </div>
      </div>
    </section>
  );
}
