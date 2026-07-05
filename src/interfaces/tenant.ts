import type { Id, Timestamps } from "@/types/common";

export type Organization = {
  id: Id;
  name: string;
  taxId?: string;
  country: string;
  planId: Id;
} & Timestamps;
