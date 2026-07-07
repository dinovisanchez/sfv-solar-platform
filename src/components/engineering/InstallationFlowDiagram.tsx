import type { InstallationStep } from "@/services/simulation/installationFlow";

export function InstallationFlowDiagram({ steps }: { steps: InstallationStep[] }) {
  return (
    <ol className="relative space-y-5 pl-2">
      <div className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 pl-0">
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
            {index + 1}
          </span>
          <div className="pt-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{step.title}</p>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
