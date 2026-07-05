import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { buttonVariants } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function Navbar() {
  return (
    <header className="sticky top-4 z-40 mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white/80 px-4 py-2.5 shadow-soft backdrop-blur-md dark:bg-slate-900/70 dark:shadow-soft-dark sm:px-6">
      <Link to={ROUTES.home} aria-label="Ir al inicio">
        <Logo />
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:text-slate-900 dark:hover:text-white">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link to={ROUTES.login} className={buttonVariants("ghost", "sm")}>
          Iniciar sesión
        </Link>
        <Link to={ROUTES.register} className={buttonVariants("primary", "sm")}>
          Crear cuenta
        </Link>
      </div>
    </header>
  );
}
