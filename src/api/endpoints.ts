export const API_ENDPOINTS = {
  projects: "/v1/projects",
  project: (id: string) => `/v1/projects/${id}`,
  projectVersions: (id: string) => `/v1/projects/${id}/versions`,
  projectShareLinks: (id: string) => `/v1/projects/${id}/share-links`,
  clients: "/v1/clients",
  quotes: "/v1/quotes",
  catalog: (category: string) => `/v1/catalog/${category}`,
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    forgotPassword: "/v1/auth/forgot-password"
  }
} as const;
