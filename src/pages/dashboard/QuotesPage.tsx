import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useRepositoryList } from "@/hooks/useRepositoryList";
import { quoteRepository } from "@/services/quotes/quoteRepository";
import { calculateQuoteTotal, type Quote } from "@/models/quote";
import { formatCOP, formatDate } from "@/utils/formatters";

export function QuotesPage() {
  const { items: quotes } = useRepositoryList(quoteRepository);

  const columns: Column<Quote>[] = [
    { header: "Cotización", accessor: (quote) => quote.id.slice(0, 8) },
    { header: "Estado", accessor: (quote) => <Badge tone="info">{quote.status}</Badge> },
    { header: "Total", accessor: (quote) => formatCOP(calculateQuoteTotal(quote)) },
    { header: "Creada", accessor: (quote) => formatDate(quote.createdAt) }
  ];

  return (
    <DashboardPage title="Cotizaciones">
      <DataTable
        columns={columns}
        rows={quotes}
        rowKey={(quote) => quote.id}
        emptyMessage="Las cotizaciones se generarán desde el módulo financiero de cada proyecto (ver ROADMAP.md, Fase 3)."
      />
    </DashboardPage>
  );
}
