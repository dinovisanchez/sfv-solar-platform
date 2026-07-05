import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  glass?: boolean;
};

export function Card({ className, glass = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-soft dark:shadow-soft-dark",
        glass ? "glass-panel" : "card-surface",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between gap-4 p-5 pb-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
