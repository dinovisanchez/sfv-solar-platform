import { useCallback, useEffect, useState } from "react";
import type { Repository } from "@/interfaces/repository";

export function useRepositoryList<T extends { id: string }>(repository: Repository<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const data = await repository.list();
    setItems(data);
    setIsLoading(false);
  }, [repository]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (entity: T) => {
      const created = await repository.create(entity);
      await reload();
      return created;
    },
    [repository, reload]
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const updated = await repository.update(id, patch);
      await reload();
      return updated;
    },
    [repository, reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await repository.remove(id);
      await reload();
    },
    [repository, reload]
  );

  return { items, isLoading, reload, create, update, remove };
}
