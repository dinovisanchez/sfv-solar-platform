import { env } from "@/config/env";
import type { ApiResult } from "@/types/common";

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

/**
 * Cliente HTTP base para cuando exista la API REST (ver ROADMAP.md, Fase 5).
 * Hoy ningún servicio lo consume: los repositorios usan localStorage
 * (src/services/storage/localStorageRepository.ts) detrás de la misma
 * interfaz Repository<T>, así que migrar a esta API no debería requerir
 * tocar las páginas.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  if (!env.apiBaseUrl) {
    return { ok: false, error: "VITE_API_BASE_URL no está configurado todavía." };
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      return { ok: false, error: `Error ${response.status}: ${response.statusText}` };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Error de red desconocido" };
  }
}
