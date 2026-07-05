import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/config/site";

const footerColumns = [
  {
    title: "Producto",
    links: [
      { label: "Dimensionador", href: "#modulos" },
      { label: "Características", href: "#caracteristicas" },
      { label: "Planes", href: "#planes" }
    ]
  },
  {
    title: "Recursos",
    links: [
      { label: "Preguntas frecuentes", href: "#faq" },
      { label: "Normativa RETIE / NTC 2050", href: "#faq" }
    ]
  },
  {
    title: "Cuenta",
    links: [
      { label: "Iniciar sesión", href: "/login" },
      { label: "Crear cuenta", href: "/register" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10 sm:px-6">
      <div className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-slate-900/60 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">{SITE.description}</p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} {SITE.fullName}. Herramienta de apoyo a la ingeniería, no reemplaza memorias de cálculo firmadas ni normativa vigente.
      </p>
    </footer>
  );
}
