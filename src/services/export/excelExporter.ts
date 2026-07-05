import type { ReportExporter } from "@/interfaces/exportProvider";

/**
 * TODO(roadmap Fase 3): integrar una librería de generación de Excel
 * (ej. exceljs o sheetjs) para BOM y reportes financieros. Contrato
 * expuesto para no acoplar las páginas a la librería final.
 */
export const excelExporter: ReportExporter = {
  format: "xlsx",
  async export() {
    throw new Error("Exportación a Excel pendiente de implementar (ver ROADMAP.md, Fase 3).");
  }
};
