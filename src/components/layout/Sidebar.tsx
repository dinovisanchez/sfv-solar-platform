import { NavLink } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { DASHBOARD_NAV } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900/60 lg:flex">
      <Logo />
      <nav className="flex flex-col gap-1">
        {DASHBOARD_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/app"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
