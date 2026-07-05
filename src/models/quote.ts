import type { Id, Timestamps } from "@/types/common";

export type QuoteStatus = "borrador" | "enviada" | "aceptada" | "rechazada";

export type QuoteLineItem = {
  id: Id;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Quote = {
  id: Id;
  organizationId: Id;
  projectId: Id;
  clientId: Id;
  status: QuoteStatus;
  currency: "COP";
  items: QuoteLineItem[];
  validUntil?: string;
} & Timestamps;

export function calculateQuoteTotal(quote: Pick<Quote, "items">): number {
  return quote.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}
