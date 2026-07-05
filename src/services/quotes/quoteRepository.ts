import type { Quote } from "@/models/quote";
import { createLocalStorageRepository } from "@/services/storage/localStorageRepository";

export const quoteRepository = createLocalStorageRepository<Quote>("sfv-quotes");
