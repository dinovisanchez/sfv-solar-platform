# Arquitectura — SFV Solar Platform

Este documento explica las decisiones de arquitectura del frontend y cómo está preparado para evolucionar hacia un software comercial multiempresa sin reestructurar el proyecto.

## 1. Principio rector

**Las páginas nunca dependen directamente de cómo ni dónde se guardan los datos.** Toda lectura/escritura pasa por una interfaz (`Repository<T>`, `MapProvider`, `SolarResourceProvider`, `ReportExporter`). Hoy esas interfaces las implementa `localStorage`; cuando exista backend, se reemplaza la implementación, no el código que la consume.

```
Page/Component
   → hook (useRepositoryList, useAuth, ...)
      → interface (Repository<T>, MapProvider, ...)
         → implementación actual: localStorage (src/services/storage)
         → implementación futura: cliente REST (src/api)
```

## 2. Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Rutas | `src/routes` | Mapear URL → layout → página. Guard de autenticación (`ProtectedRoute`) |
| Layouts | `src/layouts` | Cascarón visual compartido (público, auth, dashboard) |
| Pages | `src/pages` | Composición de una pantalla a partir de components + hooks + services |
| Components | `src/components` | UI reutilizable, sin acceso directo a datos (reciben props) |
| Hooks | `src/hooks` | Puente entre componentes y servicios/contexto (estado, efectos) |
| Context | `src/context` | Estado global transversal (tema, sesión) |
| Services | `src/services` | Lógica de negocio y acceso a datos, sin JSX |
| Models / Interfaces | `src/models`, `src/interfaces` | Contratos de dominio, sin dependencias de React |
| API | `src/api` | Cliente HTTP y endpoints para cuando exista backend |
| Config / Constants | `src/config`, `src/constants` | Datos de configuración y textos, no lógica |

## 3. Multitenancy (empresas)

Todos los modelos de dominio (`Project`, `Client`, `Quote`) incluyen `organizationId` desde el día uno (`src/models/*.ts`), aunque hoy solo exista una organización de demostración (`org-demo`, ver `AuthContext.tsx`). Esto evita la migración más costosa de un SaaS: agregar el tenant después de que el modelo de datos ya existe sin él.

`src/interfaces/tenant.ts` define `Organization`; `src/interfaces/user.ts` define `User` con `role` (`diseñador | instalador | supervisor | cliente | auditor | admin`) y `organizationId`. El backend futuro solo necesita aplicar el filtro por `organizationId` en cada consulta (o Row Level Security si es PostgreSQL) — el frontend ya asume ese límite en todos los modelos.

## 4. Licencias y suscripciones

`src/interfaces/subscription.ts` define `Plan`, `Subscription` y `License` de forma independiente del resto del dominio. `SettingsPage` y `AdminPage` ya los consumen (con datos mock) para mostrar plan actual, estado de suscripción y licencias usadas/disponibles. Cuando exista backend de facturación, estos tipos son el contrato que debe cumplir la API.

## 5. Historial, versionado y compartir proyectos

`src/models/project.ts` define, además de `Project`:

- `ProjectVersion`: snapshot versionado de un proyecto (`version`, `snapshot`, `createdBy`), pensado para que cada cambio relevante (no cada tecleo) genere una versión inmutable — el patrón habitual de "guardar versión" en herramientas de diseño.
- `ProjectShareLink`: token de enlace compartible con expiración opcional y permiso de edición (`canEdit`), para la futura función "compartir proyecto mediante enlace".

Ninguno de los dos tiene UI todavía (no se pidió implementarlos, solo prepararlos); están tipados y listos para que Fase 5 del `ROADMAP.md` los conecte a endpoints reales sin rediseñar el modelo.

## 6. Repositorio intercambiable (localStorage → API REST)

`src/interfaces/repository.ts`:

```ts
interface Repository<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
```

`src/services/storage/localStorageRepository.ts` implementa esa interfaz genéricamente; `projectRepository`, `clientRepository` y `quoteRepository` son instancias de una línea cada uno. El hook `useRepositoryList` (`src/hooks/useRepositoryList.ts`) da a cualquier página `list/create/update/remove` con estado de carga, sin duplicar lógica de fetching en cada página.

Cuando exista la API REST (`src/api/client.ts` + `src/api/endpoints.ts` ya están el esqueleto del cliente HTTP), se crea un `createRestRepository<T>(endpoint)` con la misma forma y se cambia una línea de import por repositorio. Cero cambios en páginas, hooks de UI ni componentes.

## 7. Por qué esto escala a 100.000+ proyectos sin reestructurar

1. **El modelo de datos ya es multitenant** (`organizationId` en todo): las consultas futuras se indexan por organización, que es la clave natural de particionamiento en un SaaS B2B.
2. **La paginación ya está tipada** (`Paginated<T>` en `src/types/common.ts`), aunque `useRepositoryList` hoy traiga todo de una vez desde `localStorage` (razonable con decenas de proyectos de demo). Migrar a `Repository<T>.list()` con parámetros de paginación es un cambio de firma localizado a `src/interfaces/repository.ts` y sus implementaciones — no a cada página.
3. **Ningún componente de UI asume el tamaño del dataset**: `DataTable` y `EmptyState` son genéricos y reciben filas ya resueltas; agregar paginación/scroll infinito del lado del servicio no cambia su API.
4. **El motor de cálculo (`services/calculations`) es puro y sin estado**: es trivial moverlo a un backend (Python/FastAPI, según visión del Manual Maestro) o a un Web Worker si el volumen de cálculo lo justifica, sin tocar la capa de UI.
5. **El catálogo de equipos ya está desacoplado en `services/catalog`**: pasar de mock data a una tabla con miles de fichas técnicas (y búsqueda/paginación del lado del servidor) es el mismo cambio de implementación detrás de una interfaz descrito en el punto 2.

## 8. Integraciones futuras ya con contrato definido

| Integración | Interfaz | Implementación actual |
|---|---|---|
| Mapas (Google Maps / OSM / Mapbox) | `src/interfaces/mapProvider.ts` | Stub que lanza error explicando qué falta (`src/services/maps/mapProvider.ts`) |
| Recurso solar (NASA POWER / PVGIS / Open-Meteo) | `src/interfaces/weatherProvider.ts` | Stub equivalente (`src/services/simulation/weatherProvider.ts`) |
| Exportación PDF / Excel | `src/interfaces/exportProvider.ts` | Stub equivalente (`src/services/export/*.ts`), ya invocado desde `ReportsTab` |
| API REST | `src/api/client.ts`, `src/api/endpoints.ts` | Cliente `fetch` que retorna `ApiResult<T>` tipado; sin `VITE_API_BASE_URL` retorna error controlado, no lanza excepción no manejada |

## 9. Decisiones explícitas fuera de alcance por ahora

- **No se implementó backend real.** Se pidió explícitamente dejar la arquitectura preparada, no construirlo.
- **No se implementó PWA** (excluido explícitamente por el usuario).
- **No se conectaron IA, mapas ni clima reales.** Son interfaces con implementación pendiente a propósito, para no acoplar la UI a una librería o proveedor específico antes de decidirlo.
