import { useMemo, useState } from "react";
import { AlertTriangle, BatteryCharging, Home, PanelTop, PlugZap, Ruler } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { SystemLayoutDiagram } from "@/components/engineering/SystemLayoutDiagram";
import { calculateDimensioning } from "@/services/calculations/dimensioning";
import { BATTERY_CHEMISTRY_DEFAULTS, calculateBatterySizing } from "@/services/calculations/battery";
import { recommendBattery, recommendInverter, recommendPanel } from "@/services/simulation/recommend";
import { calculateArrayLayout } from "@/services/simulation/layout";
import { HSP_BY_CITY, getHspForCity } from "@/services/simulation/hspByCity";
import { CATALOG_DATA } from "@/services/catalog/mockData";
import type { PVModule } from "@/models/catalog";
import type { GridType } from "@/models/project";

const GRID_TYPE_OPTIONS: { label: string; value: GridType }[] = [
  { label: "Monofásica", value: "monofasica" },
  { label: "Bifásica", value: "bifasica" },
  { label: "Trifásica", value: "trifasica" }
];

const CHEMISTRY_OPTIONS = [
  { label: "Litio LFP", value: "LFP" },
  { label: "Plomo AGM/Gel", value: "AGM_GEL" }
] as const;

const SURFACE_OPTIONS = [
  { label: "Techo / cubierta", value: "techo" },
  { label: "Patio / piso", value: "patio" }
] as const;

export function SimulationPage() {
  const panels = CATALOG_DATA.paneles as PVModule[];

  const [monthlyConsumptionKwh, setMonthlyConsumptionKwh] = useState(900);
  const [coveragePercent, setCoveragePercent] = useState(90);
  const [city, setCity] = useState("Bogotá");
  const [hsp, setHsp] = useState(getHspForCity("Bogotá") ?? 4.3);
  const [gridType, setGridType] = useState<GridType>("monofasica");
  const [panelId, setPanelId] = useState(panels[0]?.id ?? "");

  const [needsBattery, setNeedsBattery] = useState(false);
  const [autonomyDays, setAutonomyDays] = useState(1);
  const [criticalDailyEnergyKwh, setCriticalDailyEnergyKwh] = useState(4);
  const [criticalPowerKw, setCriticalPowerKw] = useState(1.5);
  const [chemistry, setChemistry] = useState<"LFP" | "AGM_GEL">("LFP");

  const [surface, setSurface] = useState<"techo" | "patio">("techo");
  const [areaWidthM, setAreaWidthM] = useState(8);
  const [areaHeightM, setAreaHeightM] = useState(6);

  function handleCityChange(value: string) {
    setCity(value);
    const cityHsp = getHspForCity(value);
    if (cityHsp !== null) setHsp(cityHsp);
  }

  const panel = useMemo(() => recommendPanel(panelId), [panelId]);

  const dimensioning = useMemo(
    () =>
      calculateDimensioning({
        monthlyConsumptionKwh,
        targetCoveragePercent: coveragePercent,
        hsp,
        panelWatts: panel.powerWatts,
        // El inversor real se elige despues con recommendInverter(); este valor
        // solo evita dividir por cero, el dcAcRatio real se recalcula abajo.
        inverterKw: 1,
        performanceRatio: 0.8
      }),
    [monthlyConsumptionKwh, coveragePercent, hsp, panel]
  );

  const inverterRecommendation = useMemo(
    () => recommendInverter(dimensioning.realDcKwp, gridType),
    [dimensioning.realDcKwp, gridType]
  );

  const batterySizing = useMemo(() => {
    if (!needsBattery) return null;
    const defaults = BATTERY_CHEMISTRY_DEFAULTS[chemistry];
    return calculateBatterySizing({
      criticalDailyEnergyKwh,
      autonomyDays,
      ...defaults
    });
  }, [needsBattery, chemistry, criticalDailyEnergyKwh, autonomyDays]);

  const batteryRecommendation = useMemo(() => {
    if (!needsBattery || !batterySizing) return null;
    return recommendBattery(batterySizing.requiredCapacityKwh, criticalPowerKw);
  }, [needsBattery, batterySizing, criticalPowerKw]);

  const layout = useMemo(
    () =>
      calculateArrayLayout({
        areaWidthM,
        areaHeightM,
        panelWidthM: panel.dimensionsM.width,
        panelHeightM: panel.dimensionsM.height,
        panelsNeeded: dimensioning.panelCount
      }),
    [areaWidthM, areaHeightM, panel, dimensioning.panelCount]
  );

  const installationElements = useMemo(() => {
    const items = [
      `${dimensioning.panelCount} panel(es) ${panel.manufacturer} ${panel.model} de ${panel.powerWatts} W`,
      inverterRecommendation
        ? `1 inversor ${inverterRecommendation.inverter.manufacturer} ${inverterRecommendation.inverter.model} (${inverterRecommendation.inverter.acPowerKw} kW, ${inverterRecommendation.inverter.phases === 3 ? "trifásico" : "mono/bifásico"})`
        : "Inversor: no hay un modelo compatible en el catálogo actual",
      surface === "techo"
        ? "Estructura de montaje para cubierta (rieles + ganchos o clamps según tipo de teja/lámina)"
        : "Estructura de montaje a nivel de piso o tipo carport",
      "Protecciones DC: seccionador bajo carga, fusibles de string si hay paralelos, SPD tipo 2, caja combinadora si aplica",
      `Protecciones AC: breaker de interconexión, SPD AC${needsBattery ? ", transferencia/PCS según el inversor" : ""}`,
      "Cableado: cable solar DC certificado (PV1-F / EN 50618) y conductor AC dimensionado por ampacidad y caída de tensión",
      "Puesta a tierra y equipotencialidad de toda la estructura",
      "Monitoreo de generación y medición de energía"
    ];
    if (needsBattery && batteryRecommendation) {
      items.splice(
        2,
        0,
        `${batteryRecommendation.unitsNeeded} batería(s) ${batteryRecommendation.battery.manufacturer} ${batteryRecommendation.battery.model} (${batteryRecommendation.battery.chemistry})`
      );
    }
    return items;
  }, [dimensioning.panelCount, panel, inverterRecommendation, surface, needsBattery, batteryRecommendation]);

  return (
    <DashboardPage title="Simulación">
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5">
          <Card>
            <CardHeader>
              <p className="font-semibold">Consumo y objetivo</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Consumo mensual (kWh)"
                type="number"
                min={50}
                value={monthlyConsumptionKwh}
                onChange={(event) => setMonthlyConsumptionKwh(Number(event.target.value) || 0)}
              />
              <Input
                label="Cobertura objetivo (%)"
                type="number"
                min={10}
                max={100}
                value={coveragePercent}
                onChange={(event) => setCoveragePercent(Number(event.target.value) || 0)}
              />
              <Select
                label="Ciudad (referencia de HSP)"
                value={city}
                options={HSP_BY_CITY.map((entry) => ({ label: entry.city, value: entry.city }))}
                onChange={(event) => handleCityChange(event.target.value)}
              />
              <Input
                label="HSP (editable)"
                hint="Valor de referencia aproximado, no medición satelital. Ajústalo si conoces el dato real del sitio."
                type="number"
                step="0.1"
                value={hsp}
                onChange={(event) => setHsp(Number(event.target.value) || 0)}
              />
              <Select
                label="Tipo de red"
                value={gridType}
                options={GRID_TYPE_OPTIONS}
                onChange={(event) => setGridType(event.target.value as GridType)}
              />
              <Select
                label="Panel de referencia"
                value={panelId}
                options={panels.map((item) => ({ label: `${item.manufacturer} ${item.model}`, value: item.id }))}
                onChange={(event) => setPanelId(event.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-semibold">Respaldo con batería</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={needsBattery}
                  onChange={(event) => setNeedsBattery(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Necesito batería
              </label>
            </CardHeader>
            {needsBattery && (
              <CardContent className="space-y-4">
                <Input
                  label="Días de autonomía"
                  type="number"
                  min={0.5}
                  step="0.5"
                  value={autonomyDays}
                  onChange={(event) => setAutonomyDays(Number(event.target.value) || 0)}
                />
                <Input
                  label="Energía crítica diaria (kWh)"
                  hint="Suma de las cargas que deben seguir funcionando sin red (nevera, iluminación, equipos esenciales)."
                  type="number"
                  min={0}
                  step="0.1"
                  value={criticalDailyEnergyKwh}
                  onChange={(event) => setCriticalDailyEnergyKwh(Number(event.target.value) || 0)}
                />
                <Input
                  label="Potencia crítica simultánea (kW)"
                  type="number"
                  min={0}
                  step="0.1"
                  value={criticalPowerKw}
                  onChange={(event) => setCriticalPowerKw(Number(event.target.value) || 0)}
                />
                <Select
                  label="Química de batería"
                  value={chemistry}
                  options={[...CHEMISTRY_OPTIONS]}
                  onChange={(event) => setChemistry(event.target.value as "LFP" | "AGM_GEL")}
                />
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader>
              <p className="font-semibold">Superficie de instalación</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="¿Dónde va la instalación?"
                value={surface}
                options={[...SURFACE_OPTIONS]}
                onChange={(event) => setSurface(event.target.value as "techo" | "patio")}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ancho disponible (m)"
                  type="number"
                  min={1}
                  step="0.1"
                  value={areaWidthM}
                  onChange={(event) => setAreaWidthM(Number(event.target.value) || 0)}
                />
                <Input
                  label="Largo disponible (m)"
                  type="number"
                  min={1}
                  step="0.1"
                  value={areaHeightM}
                  onChange={(event) => setAreaHeightM(Number(event.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Potencia DC" value={`${dimensioning.realDcKwp.toFixed(2)} kWp`} icon={PanelTop} />
            <StatCard label="Paneles" value={String(dimensioning.panelCount)} icon={Ruler} />
            <StatCard
              label="Relación DC/AC"
              value={inverterRecommendation ? inverterRecommendation.dcAcRatio.toFixed(2) : "—"}
              icon={PlugZap}
            />
            <StatCard
              label="Producción estimada"
              value={`${Math.round(dimensioning.estimatedMonthlyKwh)} kWh/mes`}
              icon={Home}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                  <PlugZap className="h-4 w-4" />
                </span>
                <p className="font-semibold">Inversor recomendado</p>
              </div>
            </CardHeader>
            <CardContent>
              {inverterRecommendation ? (
                <>
                  <p className="font-medium">
                    {inverterRecommendation.inverter.manufacturer} {inverterRecommendation.inverter.model}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {inverterRecommendation.reasons.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-slate-500">No hay inversores en el catálogo actual.</p>
              )}
            </CardContent>
          </Card>

          {needsBattery && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                    <BatteryCharging className="h-4 w-4" />
                  </span>
                  <p className="font-semibold">Batería recomendada</p>
                </div>
              </CardHeader>
              <CardContent>
                {batteryRecommendation ? (
                  <>
                    <p className="font-medium">
                      {batteryRecommendation.unitsNeeded} × {batteryRecommendation.battery.manufacturer}{" "}
                      {batteryRecommendation.battery.model}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      {batteryRecommendation.reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No hay baterías en el catálogo actual.</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <p className="font-semibold">Elementos que incluye la instalación</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                {installationElements.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="font-semibold">Plano de distribución ({surface === "techo" ? "cubierta" : "patio"})</p>
              <Badge tone={layout.fits ? "success" : "warning"}>
                {layout.panelsPlaced}/{dimensioning.panelCount} paneles ubicados
              </Badge>
            </CardHeader>
            <CardContent>
              {!layout.fits && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Con {areaWidthM} × {areaHeightM} m solo caben {layout.capacity} de los {dimensioning.panelCount}{" "}
                    paneles requeridos (faltan {layout.missingPanels}). Aumenta el área disponible o reduce la
                    cobertura objetivo.
                  </p>
                </div>
              )}
              <SystemLayoutDiagram layout={layout} surfaceLabel={surface === "techo" ? "el techo" : "el patio"} />
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Orientación {layout.orientation === "portrait" ? "vertical" : "horizontal"} de módulo, {layout.rows}{" "}
                fila(s) × {layout.cols} columna(s), margen perimetral de {layout.marginM} m para acceso de
                mantenimiento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}
