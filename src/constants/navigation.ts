import { Bot, Home, PackageSearch, Settings, Sparkles, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Inicio", path: ROUTES.app.overview, icon: Home },
  { label: "Simulación", path: ROUTES.app.simulation, icon: Sparkles },
  { label: "Asistente IA", path: ROUTES.app.assistant, icon: Bot },
  { label: "Catálogo", path: ROUTES.app.catalog(), icon: PackageSearch },
  { label: "Configuración", path: ROUTES.app.settings, icon: Settings }
];
