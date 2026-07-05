import type { Id, Timestamps } from "@/types/common";

export type ReportFormat = "pdf" | "xlsx";

export type ReportKind =
  | "memoria_calculo"
  | "bom"
  | "diagrama_unifilar"
  | "financiero"
  | "comisionamiento";

export type Report = {
  id: Id;
  projectId: Id;
  kind: ReportKind;
  format: ReportFormat;
  generatedAt: string;
  fileName: string;
} & Pick<Timestamps, "createdAt">;
