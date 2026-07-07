import {
  BarChart2,
  BookOpen,
  Bot,
  FileStack,
  Home,
  Layers,
  PackageSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Inicio", path: ROUTES.app.overview, icon: Home },
  { label: "Mis proyectos", path: ROUTES.app.projects, icon: Layers },
  { label: "Simulación", path: ROUTES.app.simulation, icon: Sparkles },
  { label: "Asistente IA", path: ROUTES.app.assistant, icon: Bot },
  { label: "Documentación", path: ROUTES.app.docs, icon: BookOpen },
  { label: "Clientes", path: ROUTES.app.clients, icon: Users },
  { label: "Cotizaciones", path: ROUTES.app.quotes, icon: FileStack },
  { label: "Catálogo", path: ROUTES.app.catalog(), icon: PackageSearch },
  { label: "Reportes", path: ROUTES.app.reports, icon: BarChart2 },
  { label: "Configuración", path: ROUTES.app.settings, icon: Settings },
  { label: "Administrador", path: ROUTES.app.admin, icon: ShieldCheck }
];
