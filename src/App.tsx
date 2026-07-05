import { useMemo, useState } from "react";
import {
  BarChart2,
  BatteryCharging,
  Bell,
  Calculator,
  ChevronDown,
  ClipboardCheck,
  Gauge,
  Mic,
  PanelTop,
  Play,
  PlugZap,
  Settings2,
  Sparkles,
  Sun,
  User,
  Wrench
} from "lucide-react";
import TaskCard from "./components/TaskCard";

const backgroundVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_054410_6b17f7f9-d11e-44f1-90b0-75ee563d1971.mp4";

const avatarUrls = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260403_075317_744395c6-7168-48c6-a1f6-5b9b7bd58f87.png&w=1280&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260403_075333_2caea84e-742e-4846-9284-ed8532c44c99.png&w=1280&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260403_075354_70a33cfd-3c9c-45ef-a7bb-d371cb8aa0af.png&w=1280&q=85"
];

const waveformHeights = [
  8, 16, 12, 28, 20, 36, 42, 24, 40, 16, 44, 32, 48, 28, 20, 36, 14, 32, 22,
  40, 18, 30, 12, 26, 16, 34, 20, 38, 24, 28, 16, 22, 12, 20, 8
];

function AvatarStack({ count = 3, extra = "+7" }: { count?: number; extra?: string }) {
  return (
    <div className="flex items-center -space-x-2">
      {avatarUrls.slice(0, count).map((url) => (
        <img
          key={url}
          alt="Equipo tecnico"
          className="h-8 w-8 rounded-full border-2 border-white object-cover"
          src={url}
        />
      ))}
      <span className="flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white bg-gray-950 px-2 text-xs font-semibold text-white">
        {extra}
      </span>
    </div>
  );
}

function App() {
  const [monthlyKwh, setMonthlyKwh] = useState(900);
  const [coverage, setCoverage] = useState(80);
  const [hsp, setHsp] = useState(4.5);
  const [panelW, setPanelW] = useState(610);
  const [inverterKw, setInverterKw] = useState(6);
  const performanceRatio = 0.8;

  const results = useMemo(() => {
    const dailyConsumption = monthlyKwh / 30;
    const targetDailyEnergy = dailyConsumption * (coverage / 100);
    const requiredKwp = targetDailyEnergy / (hsp * performanceRatio);
    const panels = Math.max(1, Math.ceil((requiredKwp * 1000) / panelW));
    const realDcKwp = (panels * panelW) / 1000;
    const dcAcRatio = realDcKwp / inverterKw;
    const estimatedMonthly = realDcKwp * hsp * performanceRatio * 30;

    return {
      dailyConsumption,
      targetDailyEnergy,
      requiredKwp,
      panels,
      realDcKwp,
      dcAcRatio,
      estimatedMonthly
    };
  }, [coverage, hsp, inverterKw, monthlyKwh, panelW]);

  const efficiencyScore = Math.min(
    99,
    Math.round((results.estimatedMonthly / monthlyKwh) * 100)
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <video
        className="fixed inset-0 -z-10 h-full w-full object-cover"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 -z-[9] bg-white/45 backdrop-blur-[1px]" />

      <div className="mx-auto max-w-[1800px]">
        <header
          className="animate-fade-up mb-5 flex items-center justify-between rounded-full bg-white px-4 py-2 shadow-sm sm:px-6 sm:py-3"
          style={{ animationDelay: "0s" }}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 grid-cols-2 gap-1 rounded-md bg-black p-2 sm:h-10 sm:w-10">
              <span className="rounded-full bg-white" />
              <span className="rounded-full bg-white" />
              <span className="rounded-full bg-white" />
              <span className="rounded-full bg-white" />
            </div>
            <span className="font-serif-display text-2xl sm:text-3xl">sfv</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm lg:flex">
            <a className="font-semibold text-black" href="#dimensionador">
              Dimensionador
            </a>
            <a className="text-gray-500 transition hover:text-gray-900" href="#instalacion">
              Instalacion
            </a>
            <a className="text-gray-500 transition hover:text-gray-900" href="#normas">
              Normas
            </a>
            <a className="text-gray-500 transition hover:text-gray-900" href="#ia">
              AI Solar
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full bg-gray-100 p-1 text-sm sm:flex">
              <button className="rounded-full px-4 py-2 text-gray-500" type="button">
                Demo
              </button>
              <button className="rounded-full bg-black px-4 py-2 font-semibold text-white" type="button">
                Pro
              </button>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
              type="button"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5 fill-white" />
            </button>
          </div>
        </header>

        <section
          className="animate-fade-up mb-4 grid gap-4 border-b border-black/10 pb-5 sm:mb-6 sm:pb-6 lg:grid-cols-12 lg:items-center"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-3 lg:col-span-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-emerald-500">
              <User className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-serif-display text-[30px] sm:text-[38px] lg:text-[42px]">
              Hola, ingeniero
            </h1>
          </div>
          <div className="text-[22px] font-semibold tracking-tight sm:text-[26px] lg:col-span-6">
            Dimensionador FV preliminar
          </div>
          <div className="flex items-center gap-3 lg:col-span-3 lg:justify-end">
            <span className="font-semibold">Equipo:</span>
            <AvatarStack extra="+4" />
          </div>
        </section>

        <section className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:gap-7">
          <aside className="space-y-5 lg:col-span-3">
            <div
              className="animate-fade-up flex items-center justify-between rounded-full bg-[#DBECFC] p-3"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <Sun className="h-6 w-6 text-yellow-500" strokeWidth={2.8} />
                </div>
                <div>
                  <p className="font-semibold leading-tight">Residencial On Grid</p>
                  <p className="text-sm text-gray-600">Primer caso de diseno</p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5" />
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-[80px] font-semibold leading-none tracking-[-0.04em] sm:text-[100px] lg:text-[118px] xl:text-[132px]">
                {efficiencyScore}%
              </p>
              <p className="mt-1 text-gray-700">Cobertura estimada del consumo</p>
            </div>

            <div
              className="animate-fade-up relative overflow-hidden rounded-[20px] bg-white p-5 shadow-sm sm:rounded-[28px]"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.55),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.35),transparent_30%),linear-gradient(135deg,rgba(16,185,129,0.28),rgba(255,255,255,0.1))]" />
              <div className="relative">
                <div className="mb-14 flex items-center justify-between">
                  <h2 className="font-semibold">Metricas del sistema</h2>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold">
                    Calculo
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold">{results.realDcKwp.toFixed(2)}</p>
                    <p className="text-xs text-gray-700">kWp DC</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{results.panels}</p>
                    <p className="text-xs text-gray-700">Paneles</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{results.dcAcRatio.toFixed(2)}</p>
                    <p className="text-xs text-gray-700">DC/AC</p>
                  </div>
                </div>
              </div>
              <button
                className="absolute -bottom-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-sm"
                type="button"
                aria-label="Ajustar metricas"
              >
                <Settings2 className="h-5 w-5" />
              </button>
            </div>
          </aside>

          <section id="dimensionador" className="space-y-5 lg:col-span-6 lg:mx-auto lg:w-[85%] xl:w-[85%] 2xl:w-[70%]">
            <div
              className="animate-fade-up rounded-[20px] bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-black/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Calculadora solar
                    </h2>
                    <p className="text-sm text-gray-500">Version preliminar para MVP</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
                  MVP
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Consumo mensual"
                  suffix="kWh"
                  value={monthlyKwh}
                  min={100}
                  max={5000}
                  step={50}
                  onChange={setMonthlyKwh}
                />
                <NumberField
                  label="Cobertura objetivo"
                  suffix="%"
                  value={coverage}
                  min={10}
                  max={100}
                  step={5}
                  onChange={setCoverage}
                />
                <NumberField
                  label="Horas solares pico"
                  suffix="HSP"
                  value={hsp}
                  min={2.5}
                  max={6.5}
                  step={0.1}
                  onChange={setHsp}
                />
                <NumberField
                  label="Potencia del panel"
                  suffix="W"
                  value={panelW}
                  min={350}
                  max={750}
                  step={5}
                  onChange={setPanelW}
                />
                <NumberField
                  label="Potencia inversor"
                  suffix="kW"
                  value={inverterKw}
                  min={1}
                  max={30}
                  step={0.5}
                  onChange={setInverterKw}
                />
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-gray-500">
                    Performance ratio
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{performanceRatio}</p>
                  <p className="mt-1 text-sm text-gray-500">Fijo para esta primera etapa</p>
                </div>
              </div>
            </div>

            <TaskCard
              icon={PanelTop}
              title="Arreglo fotovoltaico"
              tagText="Diseno"
              tagColor="green"
              details={[
                { label: "Potencia", value: `${results.realDcKwp.toFixed(2)} kWp` },
                { label: "Modulos", value: `${results.panels} x ${panelW} W` },
                { label: "Objetivo", value: `${coverage}%` }
              ]}
              bottomLeftContent={
                <div className="flex items-center gap-3">
                  <AvatarStack count={2} extra="+1" />
                  <span>{results.requiredKwp.toFixed(2)} kWp requeridos antes de redondear</span>
                </div>
              }
              buttonText="Validar strings"
              buttonVariant="dark"
              style={{ animationDelay: "0.35s" }}
            />

            <TaskCard
              icon={PlugZap}
              title="Compatibilidad inversor"
              tagText={results.dcAcRatio > 1.35 ? "Alerta" : "OK"}
              tagColor={results.dcAcRatio > 1.35 ? "red" : "yellow"}
              details={[
                { label: "Inversor", value: `${inverterKw.toFixed(1)} kW AC` },
                { label: "Relacion", value: results.dcAcRatio.toFixed(2) },
                { label: "Estado", value: results.dcAcRatio > 1.35 ? "Revisar" : "Normal" }
              ]}
              bottomLeftContent="Siguiente regla: comparar Voc, Vmp, Imp e Isc contra ficha tecnica real."
              buttonText="Let AI revisar"
              buttonVariant="black"
              buttonIcon={<Sparkles className="h-4 w-4" />}
              className="lg:rotate-[1.5deg]"
              style={{ animationDelay: "0.4s" }}
            />

            <TaskCard
              icon={ClipboardCheck}
              title="Instalacion guiada"
              tagText="Checklist"
              tagColor="blue"
              details={[
                { label: "Inicio", value: "EPP y cubierta" },
                { label: "Pruebas", value: "Voc, polaridad" },
                { label: "Entrega", value: "Acta" }
              ]}
              bottomLeftContent={
                <div className="flex items-center gap-3">
                  <AvatarStack extra="+5" />
                  <span>Lista preparada para tecnicos en campo</span>
                </div>
              }
              buttonText="Ver pasos"
              buttonVariant="light"
              style={{ animationDelay: "0.45s" }}
            />
          </section>

          <aside className="space-y-5 lg:col-span-3">
            <div
              className="animate-fade-up rounded-[20px] bg-white/80 p-5 shadow-sm backdrop-blur sm:rounded-[28px]"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Gauge className="h-5 w-5" />
                  </span>
                  <h2 className="text-[22px] font-semibold tracking-tight lg:text-[26px]">
                    Comandos rapidos
                  </h2>
                </div>
                <button className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white" type="button">
                  + Agregar
                </button>
              </div>
              <CommandItem text="Generar propuesta preliminar con consumo, paneles y produccion" />
              <CommandItem text="Crear checklist de visita tecnica para cubierta y tablero" />
              <CommandItem text="Revisar si la relacion DC/AC requiere otro inversor" />
            </div>

            <div
              id="ia"
              className="animate-fade-up relative rounded-[20px] bg-[#DBECFC] p-5 pb-10 shadow-sm sm:rounded-[28px]"
              style={{ animationDelay: "0.55s" }}
            >
              <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
                Asistente solar
              </span>
              <h2 className="font-serif-display mt-4 text-[34px] leading-none sm:text-[42px]">
                Dicta tu caso tecnico
              </h2>
              <div className="mt-7 flex h-14 items-center justify-between gap-1">
                {waveformHeights.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="w-0.5 rounded-full bg-blue-400"
                    style={{ height: `${height * 0.8}px` }}
                  />
                ))}
              </div>
              <button
                className="absolute -bottom-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-sm"
                type="button"
                aria-label="Grabar caso tecnico"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>

            <div
              id="normas"
              className="animate-fade-up rounded-[20px] bg-black p-5 text-white shadow-sm sm:rounded-[28px]"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-yellow-300" />
                <h2 className="text-xl font-semibold">Siguiente fase</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Conectar fichas tecnicas reales: Voc, Vmp, Isc, Imp, rango MPPT,
                limites de corriente, RETIE, NTC 2050 y requisitos del operador de red.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

type NumberFieldProps = {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function NumberField({ label, suffix, value, min, max, step, onChange }: NumberFieldProps) {
  return (
    <label className="rounded-2xl bg-gray-50 p-4">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-gray-500">
        {label}
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <input
          className="w-full bg-transparent text-2xl font-semibold outline-none"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="text-sm font-semibold text-gray-500">{suffix}</span>
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

function CommandItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/10 py-4">
      <p className="text-sm leading-5 text-gray-800">{text}</p>
      <button
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100"
        type="button"
        aria-label={text}
      >
        <Play className="h-4 w-4 fill-gray-700 text-gray-700" />
      </button>
    </div>
  );
}

export default App;
