export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  app: {
    root: "/app",
    overview: "/app",
    projects: "/app/projects",
    project: (id: string) => `/app/projects/${id}`,
    clients: "/app/clients",
    quotes: "/app/quotes",
    reports: "/app/reports",
    settings: "/app/settings",
    admin: "/app/admin",
    profile: "/app/profile",
    assistant: "/app/asistente",
    docs: "/app/documentacion",
    simulation: "/app/simulacion",
    catalog: (category?: string) => (category ? `/app/catalog/${category}` : "/app/catalog")
  }
} as const;

export const PROJECT_TABS = [
  { slug: "general", label: "General" },
  { slug: "dimensionamiento", label: "Dimensionamiento" },
  { slug: "produccion", label: "Producción" },
  { slug: "electrico", label: "Diseño eléctrico" },
  { slug: "financiero", label: "Financiero" },
  { slug: "bom", label: "Lista de materiales" },
  { slug: "diagramas", label: "Diagramas" },
  { slug: "reportes", label: "Reportes" }
] as const;

export type ProjectTabSlug = (typeof PROJECT_TABS)[number]["slug"];
