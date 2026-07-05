import type { ReportExporter } from "@/interfaces/exportProvider";

/**
 * TODO(roadmap Fase 3): integrar una librería de generación de PDF
 * (ej. @react-pdf/renderer o pdf-lib) para memorias de cálculo, BOM
 * y diagramas unifilares. Por ahora expone el contrato para que las
 * páginas puedan invocarlo sin acoplarse a la librería final.
 */
export const pdfExporter: ReportExporter = {
  format: "pdf",
  async export() {
    throw new Error("Exportación a PDF pendiente de implementar (ver ROADMAP.md, Fase 3).");
  }
};
