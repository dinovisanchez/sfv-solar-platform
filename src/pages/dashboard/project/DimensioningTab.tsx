import { useMemo, useState } from "react";
import { PanelTop, PlugZap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NumberSliderField } from "@/components/engineering/NumberSliderField";
import { TaskCard } from "@/components/dashboard/TaskCard";
import {
  DC_AC_RATIO_WARNING_THRESHOLD,
  calculateDimensioning,
  estimateCoverageScore
} from "@/services/calculations/dimensioning";

export function DimensioningTab() {
  const [monthlyKwh, setMonthlyKwh] = useState(900);
  const [coverage, setCoverage] = useState(80);
  const [hsp, setHsp] = useState(4.5);
  const [panelW, setPanelW] = useState(610);
  const [inverterKw, setInverterKw] = useState(6);
  const performanceRatio = 0.8;

  const result = useMemo(
    () =>
      calculateDimensioning({
        monthlyConsumptionKwh: monthlyKwh,
        targetCoveragePercent: coverage,
        hsp,
        panelWatts: panelW,
        inverterKw,
        performanceRatio
      }),
    [monthlyKwh, coverage, hsp, panelW, inverterKw]
  );

  const coverageScore = estimateCoverageScore(result, monthlyKwh);
  const dcAcWarning = result.dcAcRatio > DC_AC_RATIO_WARNING_THRESHOLD;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div>
            <p className="font-semibold">Dimensionador FV preliminar</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fórmula preliminar (HSP × PR). No reemplaza simulación horaria ni validación de strings.
            </p>
          </div>
          <Badge tone="info">{coverageScore}% cobertura</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <NumberSliderField label="Consumo mensual" suffix="kWh" value={monthlyKwh} min={100} max={5000} step={50} onChange={setMonthlyKwh} />
          <NumberSliderField label="Cobertura objetivo" suffix="%" value={coverage} min={10} max={100} step={5} onChange={setCoverage} />
          <NumberSliderField label="Horas solares pico" suffix="HSP" value={hsp} min={2.5} max={6.5} step={0.1} onChange={setHsp} />
          <NumberSliderField label="Potencia del panel" suffix="W" value={panelW} min={350} max={750} step={5} onChange={setPanelW} />
          <NumberSliderField label="Potencia inversor" suffix="kW" value={inverterKw} min={1} max={30} step={0.5} onChange={setInverterKw} />
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              Performance ratio
            </p>
            <p className="mt-2 text-2xl font-semibold">{performanceRatio}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fijo para esta etapa</p>
          </div>
        </CardContent>
      </Card>

      <TaskCard
        icon={PanelTop}
        title="Arreglo fotovoltaico"
        tagText="Diseño"
        tagColor="green"
        details={[
          { label: "Potencia", value: `${result.realDcKwp.toFixed(2)} kWp` },
          { label: "Módulos", value: `${result.panelCount} x ${panelW} W` },
          { label: "Objetivo", value: `${coverage}%` }
        ]}
        bottomLeftContent={`${result.requiredKwp.toFixed(2)} kWp requeridos antes de redondear`}
        buttonText="Validar strings"
        buttonVariant="dark"
      />

      <TaskCard
        icon={PlugZap}
        title="Compatibilidad inversor"
        tagText={dcAcWarning ? "Alerta" : "OK"}
        tagColor={dcAcWarning ? "red" : "yellow"}
        details={[
          { label: "Inversor", value: `${inverterKw.toFixed(1)} kW AC` },
          { label: "Relación", value: result.dcAcRatio.toFixed(2) },
          { label: "Estado", value: dcAcWarning ? "Revisar" : "Normal" }
        ]}
        bottomLeftContent="Siguiente paso: comparar Voc, Vmp, Imp e Isc contra ficha técnica real del catálogo."
        buttonText="Revisar con catálogo"
        buttonVariant="black"
        buttonIcon={<Sparkles className="h-4 w-4" />}
      />
    </div>
  );
}
