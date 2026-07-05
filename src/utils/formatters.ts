const copCurrency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

const decimal = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
  month: "short",
  day: "2-digit"
});

export function formatCOP(value: number): string {
  return copCurrency.format(value);
}

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${decimal.format(Number(value.toFixed(fractionDigits)))}%`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(date);
}

export function formatKwp(value: number): string {
  return `${formatNumber(value, 2)} kWp`;
}

export function formatKwh(value: number): string {
  return `${formatNumber(value, 0)} kWh`;
}
