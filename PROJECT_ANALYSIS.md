# Análisis del Proyecto — SFV Solar Platform

Fecha de esta versión: 2026-07-05 (actualizado tras la migración a plataforma SaaS).
Rol: Arquitecto de Software Senior / UX-UI Designer Senior / Ingeniero Especialista en Sistemas Fotovoltaicos.

> Esta es la versión vigente del análisis. La versión anterior describía el proyecto cuando era un MVP de una sola calculadora sin routing ni backend-ready architecture; ese estado quedó documentado en el historial de Git y en `CHANGELOG.md`.

---

## 1. Resumen del proyecto

`sfv-solar-platform` es una plataforma web tipo SaaS para el diseño, simulación y gestión de proyectos de ingeniería fotovoltaica en Colombia. Es una SPA (React + Vite + TypeScript + Tailwind + React Router), sin backend todavía, pero con toda la arquitectura de frontend preparada para evolucionar a un producto comercial multiempresa: landing pública, dashboard de acceso libre, módulos de ingeniería (dimensionamiento, financiero, y stubs estructurados para producción/eléctrico/BOM/diagramas/reportes), un módulo de **Simulación** que recomienda batería/inversor reales del catálogo con justificación y dibuja el arreglo de paneles a escala, una página de **Documentación** navegable, un **Asistente IA local**, catálogo de equipos, y puntos de extensión explícitos para mapas, recurso solar, exportación de reportes y una futura API REST.

El motor de cálculo original (dimensionamiento HSP × PR) se conservó íntegro — se extrajo a `src/services/calculations/dimensioning.ts` y ahora se reutiliza dentro del dashboard en vez de vivir en un único componente de página.

## 2. Arquitectura

Capas separadas por responsabilidad (ver `ARCHITECTURE.md` para el detalle):

```
Rutas (src/routes/AppRoutes.tsx)
  → Layouts (Public / Auth / Dashboard)
    → Pages (landing, auth, dashboard, catalog)
      → Components (ui / layout / landing / dashboard / engineering)
        → Hooks (useAuth, useTheme, useRepositoryList, ...)
          → Services (calculations, projects, clients, quotes, catalog, export, maps, simulation, storage)
            → Models / Interfaces (contratos de dominio, independientes de la UI)
```

Todavía no hay backend: los "servicios" de datos (`projectRepository`, `clientRepository`, `quoteRepository`) implementan la interfaz genérica `Repository<T>` (`src/interfaces/repository.ts`) sobre `localStorage`. El día que exista una API REST, solo se reemplaza la implementación detrás de esa interfaz — las páginas no cambian.

## 3. Estructura de carpetas

```
src/
├── api/              cliente HTTP base + endpoints REST futuros (sin uso real todavía)
├── assets/           (reservado; sin dependencias de CDN de terceros)
├── components/
│   ├── ui/            Button, Card, Badge, Input, Select, Tabs, StatCard, DataTable, EmptyState, ThemeToggle, Logo
│   ├── layout/         Navbar, Footer, Sidebar, Topbar
│   ├── landing/        Hero, Features, Modules, Screenshots, Pricing, FAQ, CTASection
│   ├── dashboard/       DashboardPage (wrapper), TaskCard (heredado del MVP, adaptado a dark mode)
│   ├── engineering/     NumberSliderField, MapPreviewPlaceholder, SystemLayoutDiagram (plano SVG a escala)
│   ├── assistant/       AssistantChat.tsx (chat reutilizable, landing + dashboard)
│   └── docs/            MarkdownContent.tsx (render de Markdown de los manuales via `marked`)
├── config/            site.ts (contenido de landing/nav/planes/FAQ), env.ts
├── constants/          routes.ts, navigation.ts
├── context/            ThemeContext, AuthContext
├── hooks/               useTheme, useAuth, useLocalStorage, useRepositoryList
├── interfaces/          repository, tenant, user, subscription, mapProvider, weatherProvider, exportProvider
├── layouts/             PublicLayout, AuthLayout, DashboardLayout
├── models/              project, client, quote, report, catalog
├── pages/
│   ├── landing/HomePage.tsx
│   ├── auth/            LoginPage, RegisterPage, ForgotPasswordPage
│   ├── dashboard/        OverviewPage, ProjectsListPage, ProjectDetailPage, ClientsPage, QuotesPage,
│   │                     ReportsPage, SettingsPage, AdminPage, ProfilePage, AssistantPage, DocsPage,
│   │                     SimulationPage
│   │   └── project/       GeneralTab, DimensioningTab, ProductionTab, ElectricalTab, FinancialTab,
│   │                       BOMTab, DiagramsTab, ReportsTab
│   ├── catalog/CatalogListPage.tsx (genérico, parametrizado por categoría)
│   └── misc/NotFoundPage.tsx
├── routes/              AppRoutes.tsx, ProtectedRoute.tsx
├── services/
│   ├── calculations/     dimensioning.ts (motor original extraído), financial.ts (VPN/TIR/payback/ROI reales),
│   │                     battery.ts (capacidad nominal por autonomía/DoD/eficiencia)
│   ├── storage/          localStorageRepository.ts (factoría genérica Repository<T>)
│   ├── projects/ clients/ quotes/  repositorios concretos sobre la factoría
│   ├── catalog/           categories.ts, mockData.ts
│   ├── export/            pdfExporter.ts, excelExporter.ts (interfaz lista, implementación pendiente)
│   ├── maps/               mapProvider.ts (Google/OSM/Mapbox, interfaz lista, pendiente)
│   ├── simulation/         weatherProvider.ts (NASA POWER/PVGIS/Open-Meteo, interfaz lista, pendiente),
│   │                       hspByCity.ts (referencia aproximada por ciudad), layout.ts (paneles que caben
│   │                       en un área dada), recommend.ts (elige panel/inversor/batería del catálogo
│   │                       y arma el porqué de la recomendación)
│   └── assistant/          knowledgeBase.ts, search.ts, formatAnswer.ts — asistente local sobre los
│                            manuales del repo (?raw + búsqueda por palabras clave, sin backend)
├── styles/globals.css     Tailwind + tokens de tema claro/oscuro + glassmorphism + animaciones
├── types/common.ts        Id, Timestamps, Paginated<T>, ApiResult<T>, SelectOption
└── utils/                 cn.ts, formatters.ts
```

## 4. Tecnologías

- **React 18 + TypeScript 5.8 (strict)** — sin cambios respecto al MVP original.
- **Vite 7** con alias `@/` → `src/` (vía `vite.config.ts` + `tsconfig.json`).
- **React Router 6** — rutas públicas, de autenticación (opcional) y de dashboard (`/app/*`, acceso libre).
- **Tailwind CSS 3** con `darkMode: "class"`, paleta de marca (`brand`, `solar`), gradientes y animaciones propias.
- **clsx** para composición condicional de clases (`src/utils/cn.ts`).
- **lucide-react** para iconografía.
- Sin dependencias de servicios de terceros con datos reales todavía (mapas, clima, PDF/Excel son interfaces sin implementar). El asistente IA es la excepción: es una funcionalidad real hoy, pero local (búsqueda sobre los manuales embebidos en el bundle vía `?raw`), sin llamar a ningún servicio externo.

## 5. Flujo de funcionamiento

```
Visitante → Landing (/) → "Abrir la plataforma" → /app (sin login, acceso libre)
  → Overview: métricas agregadas de proyectos/clientes/cotizaciones (localStorage)
  → Proyectos: crear/listar → Detalle de proyecto con tabs
      General (cliente, ubicación, coordenadas, empresa, fecha, estado)
      Dimensionamiento (motor de cálculo real, idéntico al MVP original)
      Producción / Diseño eléctrico (estructura lista, cálculo pendiente)
      Financiero (VPN/TIR/payback/ROI reales)
      BOM / Diagramas (estructura lista, generación pendiente)
      Reportes (botones de exportación PDF/Excel que exponen el contrato, implementación pendiente)
  → Simulación: consumo + ciudad (HSP referencia) + red + ¿batería? + techo/patio con dimensiones
      → dimensionamiento real, inversor y batería recomendados del catálogo (con el porqué),
        lista de elementos de la instalación, y plano SVG a escala del arreglo de paneles
  → Asistente IA: preguntas libres respondidas solo con el Manual Maestro y la Guía Práctica (sin LLM externo)
  → Documentación: mismas fuentes, pero navegables como lectura (tabla de contenidos + buscador)
  → Clientes, Cotizaciones, Catálogo, Reportes, Configuración, Administrador
  → (Opcional) Login/Registro/Perfil: personalizar nombre y rol de la sesión local, no es requisito
```

## 6. Estado actual

| Aspecto | Estado |
|---|---|
| Routing | Completo: landing pública, auth opcional, dashboard de acceso libre |
| Dark/Light mode | Completo, persistente en `localStorage`, respeta preferencia del sistema al primer uso |
| Autenticación | Mock local, opcional (no bloquea el dashboard); arquitectura de roles lista para cuando exista backend |
| Asistente IA | Funcional: búsqueda local sobre el Manual Maestro y la Guía Práctica, sin LLM externo ni backend, siempre cita la fuente |
| Documentación | Funcional: misma base que el asistente, pero como lectura navegable (TOC + buscador + Markdown renderizado) |
| Simulación | Funcional: dimensionamiento + batería/inversor recomendados del catálogo con justificación + plano SVG a escala del arreglo sobre techo/patio, con aviso si los paneles no caben en el área indicada |
| Persistencia | `localStorage` detrás de `Repository<T>`, swappable a REST sin tocar páginas |
| Dimensionamiento FV | Funcional, reutiliza el motor original (también integrado en Simulación) |
| Financiero (VPN/TIR/ROI/payback) | Funcional, fórmulas reales implementadas |
| Producción, diseño eléctrico, BOM, diagramas | Estructura y navegación listas; cálculo/generación pendiente (ver `TODO.md`) |
| Catálogo de equipos | Funcional con datos mock tipados, componente genérico por categoría |
| Mapas / recurso solar / export PDF-Excel | Interfaces y stubs listos; sin proveedor real conectado |
| Despliegue | `render.yaml` + README listos para Render Free (Static Site) |
| Tests / CI | Sin cambios respecto al MVP: siguen sin existir (ver `TODO.md`) |

**Nota sobre solapamiento intencional**: `/app/simulacion` (independiente) y la pestaña "Dimensionamiento" dentro de un proyecto (`/app/projects/:id?tab=dimensionamiento`) hoy son dos flujos separados — Simulación es el wizard completo (batería, inversor, plano); la pestaña de proyecto es el cálculo preliminar heredado del MVP. Conectar el resultado de Simulación a un proyecto guardado es un pendiente explícito (ver `TODO.md`).

Ver `ARCHITECTURE.md` para las decisiones de escalabilidad (multitenant, licencias, versionado de proyectos, API REST futura) y `ROADMAP.md` para el plan de fases hacia el producto de ingeniería completo.
