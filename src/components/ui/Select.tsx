import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import type { SelectOption } from "@/types/common";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <label className="block" htmlFor={selectId}>
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
);

Select.displayName = "Select";
