export type FinancialInput = {
  initialInvestment: number;
  annualSavings: number;
  annualDegradationPercent: number;
  annualOmCost: number;
  discountRatePercent: number;
  horizonYears: number;
};

export type FinancialResult = {
  cashFlows: number[];
  npv: number;
  irr: number | null;
  simplePaybackYears: number | null;
  discountedPaybackYears: number | null;
  roiPercent: number;
};

function buildCashFlows(input: FinancialInput): number[] {
  const flows: number[] = [-input.initialInvestment];
  for (let year = 1; year <= input.horizonYears; year += 1) {
    const degradation = Math.pow(1 - input.annualDegradationPercent / 100, year - 1);
    const savings = input.annualSavings * degradation;
    flows.push(savings - input.annualOmCost);
  }
  return flows;
}

function npvAt(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((total, flow, year) => total + flow / Math.pow(1 + rate, year), 0);
}

function calculateIrr(cashFlows: number[]): number | null {
  let low = -0.99;
  let high = 5;
  let lowValue = npvAt(low, cashFlows);
  const highValue = npvAt(high, cashFlows);

  if (Math.sign(lowValue) === Math.sign(highValue)) {
    return null;
  }

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const mid = (low + high) / 2;
    const midValue = npvAt(mid, cashFlows);
    if (Math.abs(midValue) < 1e-6) return mid;
    if (Math.sign(midValue) === Math.sign(lowValue)) {
      low = mid;
      lowValue = midValue;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function calculatePayback(cashFlows: number[], discounted: boolean, rate: number): number | null {
  let cumulative = 0;
  for (let year = 0; year < cashFlows.length; year += 1) {
    const flow = discounted ? cashFlows[year] / Math.pow(1 + rate, year) : cashFlows[year];
    const previousCumulative = cumulative;
    cumulative += flow;
    if (year > 0 && previousCumulative < 0 && cumulative >= 0) {
      const remaining = -previousCumulative;
      const fraction = remaining / (cumulative - previousCumulative);
      return year - 1 + fraction;
    }
  }
  return null;
}

export function calculateFinancials(input: FinancialInput): FinancialResult {
  const cashFlows = buildCashFlows(input);
  const rate = input.discountRatePercent / 100;
  const npv = npvAt(rate, cashFlows);
  const irr = calculateIrr(cashFlows);
  const totalSavings = cashFlows.slice(1).reduce((total, flow) => total + flow, 0);

  return {
    cashFlows,
    npv,
    irr,
    simplePaybackYears: calculatePayback(cashFlows, false, rate),
    discountedPaybackYears: calculatePayback(cashFlows, true, rate),
    roiPercent: input.initialInvestment > 0 ? (totalSavings / input.initialInvestment) * 100 : 0
  };
}
