import { cn } from "@/utils/cn";

export type TabItem = {
  slug: string;
  label: string;
};

type TabsProps = {
  items: readonly TabItem[];
  active: string;
  onChange: (slug: string) => void;
  className?: string;
};

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1 dark:bg-white/5",
        className
      )}
      role="tablist"
    >
      {items.map((item) => (
        <button
          key={item.slug}
          type="button"
          role="tab"
          aria-selected={active === item.slug}
          onClick={() => onChange(item.slug)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            active === item.slug
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
