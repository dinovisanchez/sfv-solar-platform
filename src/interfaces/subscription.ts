import type { Id, Timestamps } from "@/types/common";

export type PlanTier = "starter" | "profesional" | "empresa";

export type Plan = {
  id: Id;
  tier: PlanTier;
  name: string;
  maxProjects: number | null;
  maxUsers: number | null;
  features: string[];
};

export type SubscriptionStatus = "activa" | "en_prueba" | "vencida" | "cancelada";

export type Subscription = {
  id: Id;
  organizationId: Id;
  planId: Id;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
} & Timestamps;

export type License = {
  id: Id;
  organizationId: Id;
  subscriptionId: Id;
  seats: number;
  seatsUsed: number;
} & Timestamps;
