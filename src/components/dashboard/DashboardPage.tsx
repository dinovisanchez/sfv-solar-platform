import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/Topbar";

type DashboardPageProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function DashboardPage({ title, actions, children }: DashboardPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title={title} />
      <div className="flex-1 space-y-6 p-5 sm:p-8">
        {actions && <div className="flex flex-wrap items-center justify-end gap-3">{actions}</div>}
        {children}
      </div>
    </div>
  );
}
