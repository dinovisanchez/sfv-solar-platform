import type { Id, Timestamps } from "@/types/common";

export type Client = {
  id: Id;
  organizationId: Id;
  name: string;
  email?: string;
  phone?: string;
  city: string;
  department: string;
  company?: string;
  notes?: string;
} & Timestamps;

export function createEmptyClient(organizationId: Id, name: string): Client {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    organizationId,
    name,
    city: "",
    department: "",
    createdAt: now,
    updatedAt: now
  };
}
