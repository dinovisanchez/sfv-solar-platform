import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendTone?: "up" | "down" | "neutral";
};

const trendStyles = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-slate-500 dark:text-slate-400"
};

export function StatCard({ label, value, icon: Icon, trend, trendTone = "neutral" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {trend && <p className={cn("mt-1 text-sm font-medium", trendStyles[trendTone])}>{trend}</p>}
    </Card>
  );
}
