import type { Project } from "@/models/project";
import { createLocalStorageRepository } from "@/services/storage/localStorageRepository";

export const projectRepository = createLocalStorageRepository<Project>("sfv-projects");
