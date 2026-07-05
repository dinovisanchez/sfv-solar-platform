import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/70 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/40 sm:px-8">
      <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notificaciones"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Link
          to={ROUTES.app.profile}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-sm font-semibold text-white"
        >
          {(user?.name ?? "U").charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
