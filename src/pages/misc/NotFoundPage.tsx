import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-serif-display text-6xl">404</p>
      <p className="text-slate-600 dark:text-slate-300">Esta página no existe o fue movida.</p>
      <Link to={ROUTES.home} className={buttonVariants("primary", "md")}>
        Volver al inicio
      </Link>
    </div>
  );
}
