type NumberSliderFieldProps = {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function NumberSliderField({ label, suffix, value, min, max, step, onChange }: NumberSliderFieldProps) {
  return (
    <label className="block rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <input
          className="w-full bg-transparent text-2xl font-semibold text-slate-900 outline-none dark:text-white"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? parsed : min);
          }}
        />
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span>
      </div>
      <input
        className="mt-3 w-full"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
