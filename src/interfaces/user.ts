import type { Id, Timestamps } from "@/types/common";

export type Role = "diseñador" | "instalador" | "supervisor" | "cliente" | "auditor" | "admin";

export type User = {
  id: Id;
  organizationId: Id;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
} & Timestamps;
