import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type TagColor = "green" | "yellow" | "red" | "blue";
type ButtonVariant = "dark" | "light" | "black";

type Detail = {
  label: string;
  value: string;
};

type TaskCardProps = {
  icon: LucideIcon;
  title: string;
  tagText: string;
  tagColor: TagColor;
  details: Detail[];
  bottomLeftContent: ReactNode;
  buttonText: string;
  buttonVariant: ButtonVariant;
  buttonIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const tagStyles: Record<TagColor, string> = {
  green: "bg-emerald-500 text-white",
  yellow: "bg-yellow-400 text-gray-950",
  red: "bg-red-500 text-white",
  blue: "bg-blue-500 text-white"
};

const buttonStyles: Record<ButtonVariant, string> = {
  dark: "bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
  black: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  light: "bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
};

export function TaskCard({
  icon: Icon,
  title,
  tagText,
  tagColor,
  details,
  bottomLeftContent,
  buttonText,
  buttonVariant,
  buttonIcon,
  className = "",
  style
}: TaskCardProps) {
  return (
    <article
      className={cn(
        "card-surface animate-fade-up rounded-[20px] px-4 py-4 shadow-soft dark:shadow-soft-dark sm:rounded-[28px] sm:px-6 sm:py-5",
        className
      )}
      style={style}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-900/10 pb-4 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-sm font-medium", tagStyles[tagColor])}>
          {tagText}
        </span>
      </div>

      <div className="flex gap-3 border-b border-slate-900/10 py-4 dark:border-white/10">
        {details.map((detail, index) => (
          <div key={`${detail.label}-${detail.value}`} className={index === 2 ? "max-w-[130px] flex-[0.6]" : "flex-1"}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              {detail.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white sm:text-base">
              {detail.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-slate-700 dark:text-slate-300">{bottomLeftContent}</div>
        <button
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            buttonStyles[buttonVariant]
          )}
          type="button"
        >
          {buttonIcon}
          {buttonText}
        </button>
      </div>
    </article>
  );
}
