import type { Repository } from "@/interfaces/repository";

function readAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, items: T[]): void {
  window.localStorage.setItem(key, JSON.stringify(items));
}

/**
 * Repositorio de respaldo mientras no existe backend. Implementa la misma
 * interfaz Repository<T> que consumirá un cliente REST futuro (src/api),
 * de forma que las páginas nunca dependan de si el dato viene de
 * localStorage o de una API.
 */
export function createLocalStorageRepository<T extends { id: string }>(storageKey: string): Repository<T> {
  return {
    async list() {
      return readAll<T>(storageKey);
    },
    async get(id) {
      const items = readAll<T>(storageKey);
      return items.find((item) => item.id === id) ?? null;
    },
    async create(entity) {
      const items = readAll<T>(storageKey);
      writeAll(storageKey, [...items, entity]);
      return entity;
    },
    async update(id, patch) {
      const items = readAll<T>(storageKey);
      let updated: T | null = null;
      const next = items.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...patch };
        return updated;
      });
      if (!updated) {
        throw new Error(`No se encontró el registro ${id} en ${storageKey}`);
      }
      writeAll(storageKey, next);
      return updated;
    },
    async remove(id) {
      const items = readAll<T>(storageKey);
      writeAll(
        storageKey,
        items.filter((item) => item.id !== id)
      );
    }
  };
}
