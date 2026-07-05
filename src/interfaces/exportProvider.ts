export type ExportFormat = "pdf" | "xlsx";

export type ExportResult = {
  fileName: string;
  blob: Blob;
};

export interface ReportExporter {
  readonly format: ExportFormat;
  export(payload: Record<string, unknown>): Promise<ExportResult>;
}
