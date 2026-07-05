import type { Client } from "@/models/client";
import { createLocalStorageRepository } from "@/services/storage/localStorageRepository";

export const clientRepository = createLocalStorageRepository<Client>("sfv-clients");
