export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  app: {
    root: "/app",
    overview: "/app",
    simulation: "/app/simulacion",
    assistant: "/app/asistente",
    settings: "/app/settings",
    profile: "/app/profile",
    catalog: (category?: string) => (category ? `/app/catalog/${category}` : "/app/catalog")
  }
} as const;
