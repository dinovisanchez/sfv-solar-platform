import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/constants/routes";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-grid-fade px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link to={ROUTES.home}>
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="card-surface rounded-3xl p-6 shadow-soft dark:shadow-soft-dark sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
