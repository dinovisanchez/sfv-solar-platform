import { useMemo, useState } from "react";
import { BarChart2, Percent, PiggyBank, Timer } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { NumberSliderField } from "@/components/engineering/NumberSliderField";
import { calculateFinancials } from "@/services/calculations/financial";
import { formatCOP, formatPercent } from "@/utils/formatters";

export function FinancialTab() {
  const [initialInvestment, setInitialInvestment] = useState(35_000_000);
  const [annualSavings, setAnnualSavings] = useState(8_500_000);
  const [annualDegradationPercent, setAnnualDegradationPercent] = useState(0.5);
  const [annualOmCost, setAnnualOmCost] = useState(400_000);
  const [discountRatePercent, setDiscountRatePercent] = useState(10);
  const [horizonYears, setHorizonYears] = useState(20);

  const result = useMemo(
    () =>
      calculateFinancials({
        initialInvestment,
        annualSavings,
        annualDegradationPercent,
        annualOmCost,
        discountRatePercent,
        horizonYears
      }),
    [initialInvestment, annualSavings, annualDegradationPercent, annualOmCost, discountRatePercent, horizonYears]
  );

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div>
            <p className="font-semibold">Supuestos financieros</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ROI, VPN, TIR y periodo de retorno a partir del ahorro estimado.
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NumberSliderField
            label="Inversión inicial"
            suffix="COP"
            value={initialInvestment}
            min={5_000_000}
            max={200_000_000}
            step={500_000}
            onChange={setInitialInvestment}
          />
          <NumberSliderField
            label="Ahorro anual estimado"
            suffix="COP"
            value={annualSavings}
            min={500_000}
            max={60_000_000}
            step={100_000}
            onChange={setAnnualSavings}
          />
          <NumberSliderField
            label="Costo O&M anual"
            suffix="COP"
            value={annualOmCost}
            min={0}
            max={5_000_000}
            step={50_000}
            onChange={setAnnualOmCost}
          />
          <NumberSliderField
            label="Degradación anual"
            suffix="%"
            value={annualDegradationPercent}
            min={0}
            max={2}
            step={0.1}
            onChange={setAnnualDegradationPercent}
          />
          <NumberSliderField
            label="Tasa de descuento"
            suffix="%"
            value={discountRatePercent}
            min={0}
            max={25}
            step={0.5}
            onChange={setDiscountRatePercent}
          />
          <NumberSliderField
            label="Horizonte"
            suffix="años"
            value={horizonYears}
            min={5}
            max={30}
            step={1}
            onChange={setHorizonYears}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="VPN" value={formatCOP(result.npv)} icon={PiggyBank} />
        <StatCard label="TIR" value={result.irr !== null ? formatPercent(result.irr * 100) : "N/A"} icon={Percent} />
        <StatCard
          label="Periodo de retorno simple"
          value={result.simplePaybackYears !== null ? `${result.simplePaybackYears.toFixed(1)} años` : "N/A"}
          icon={Timer}
        />
        <StatCard label="ROI del horizonte" value={formatPercent(result.roiPercent)} icon={BarChart2} />
      </div>
    </div>
  );
}
