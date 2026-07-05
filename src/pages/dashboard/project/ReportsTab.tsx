import { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { pdfExporter } from "@/services/export/pdfExporter";
import { excelExporter } from "@/services/export/excelExporter";

export function ReportsTab() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleExport(exporter: typeof pdfExporter | typeof excelExporter) {
    try {
      await exporter.export({});
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible generar el reporte.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="font-semibold">Reportes</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Memoria de cálculo, BOM y financiero exportables a PDF y Excel.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => handleExport(pdfExporter)}>
            <FileText className="h-4 w-4" /> Exportar a PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport(excelExporter)}>
            <FileSpreadsheet className="h-4 w-4" /> Exportar a Excel
          </Button>
        </div>
        {message && <p className="text-sm text-amber-600 dark:text-amber-400">{message}</p>}
      </CardContent>
    </Card>
  );
}
