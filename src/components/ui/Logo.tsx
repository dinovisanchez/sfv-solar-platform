import { cn } from "@/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-lg bg-slate-900 p-1.5 dark:bg-white">
        <span className="rounded-full bg-white dark:bg-slate-900" />
        <span className="rounded-full bg-white dark:bg-slate-900" />
        <span className="rounded-full bg-white dark:bg-slate-900" />
        <span className="rounded-full bg-white dark:bg-slate-900" />
      </div>
      <span className="font-serif-display text-xl">sfv</span>
    </div>
  );
}
