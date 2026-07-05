import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Sidebar } from "@/components/layout/Sidebar";
import { DASHBOARD_NAV } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900/60 lg:hidden">
          <Logo />
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileNavOpen(false)} />
            <div className="relative flex w-72 flex-col gap-6 bg-white p-5 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {DASHBOARD_NAV.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/app"}
                    onClick={() => setMobileNavOpen(false)}
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
            </div>
          </div>
        )}

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
