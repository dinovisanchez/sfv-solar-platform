import type { Id, Timestamps } from "@/types/common";

export type ProjectStatus = "borrador" | "en_diseno" | "en_revision" | "aprobado" | "instalado" | "archivado";

export type ProjectType = "residencial" | "comercial" | "industrial" | "rural";

export type GridType = "monofasica" | "bifasica" | "trifasica";

export type SystemObjective = "autoconsumo" | "respaldo" | "excedentes" | "bombeo" | "microred";

export type ProjectLocation = {
  city: string;
  department: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type Project = {
  id: Id;
  organizationId: Id;
  name: string;
  clientId: Id;
  company?: string;
  location: ProjectLocation;
  projectType: ProjectType;
  gridType: GridType;
  objective: SystemObjective;
  status: ProjectStatus;
  currentVersion: number;
} & Timestamps;

export type ProjectVersion = {
  id: Id;
  projectId: Id;
  version: number;
  label?: string;
  snapshot: unknown;
  createdAt: string;
  createdBy: Id;
};

export type ProjectShareLink = {
  id: Id;
  projectId: Id;
  token: string;
  expiresAt?: string;
  canEdit: boolean;
  createdAt: string;
};

export function createEmptyProject(input: {
  organizationId: Id;
  clientId: Id;
  name: string;
}): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    organizationId: input.organizationId,
    clientId: input.clientId,
    name: input.name,
    location: { city: "", department: "" },
    projectType: "residencial",
    gridType: "monofasica",
    objective: "autoconsumo",
    status: "borrador",
    currentVersion: 1,
    createdAt: now,
    updatedAt: now
  };
}
