# TODO — SFV Solar Platform

Pendientes concretos tras la migración a plataforma SaaS. Ordenados por área, no por prioridad (la priorización vive en `ROADMAP.md`).

## Backend

- [ ] Definir y desplegar la API REST (`src/api/endpoints.ts` ya define el contrato esperado).
- [ ] Implementar `createRestRepository<T>` cumpliendo `Repository<T>` y reemplazar `localStorageRepository` en `projectRepository`/`clientRepository`/`quoteRepository`.
- [ ] Autenticación real (JWT/OAuth) detrás de `AuthContext` — hoy `login`/`register`/`requestPasswordReset` son mocks locales.
- [ ] Multitenancy real en base de datos (filtrado/RLS por `organizationId`).

## Motor de ingeniería

- [ ] Producción energética con series horarias reales (`ProductionTab`, hoy es un `EmptyState`).
- [ ] Diseño eléctrico: strings, protecciones DC/AC, cableado, caída de tensión (`ElectricalTab`).
- [ ] Validación de compatibilidad panel-inversor contra ficha técnica real del catálogo (hoy solo compara relación DC/AC).
- [ ] BOM generado desde el diseño (`BOMTab`).
- [ ] Diagrama unifilar generado desde el modelo (`DiagramsTab`).

## Integraciones externas

- [ ] Conectar un `MapProvider` real (`src/services/maps/mapProvider.ts`) — Google Maps requiere `VITE_GOOGLE_MAPS_API_KEY`, Mapbox requiere `VITE_MAPBOX_TOKEN`, OpenStreetMap/Nominatim no requiere llave.
- [ ] Conectar un `SolarResourceProvider` real (`src/services/simulation/weatherProvider.ts`) — NASA POWER, PVGIS u Open-Meteo.
- [ ] Implementar `pdfExporter` (`src/services/export/pdfExporter.ts`) con una librería real (ej. `@react-pdf/renderer` o `pdf-lib`).
- [ ] Implementar `excelExporter` (`src/services/export/excelExporter.ts`) con una librería real (ej. `exceljs`).

## Catálogo

- [ ] Reemplazar `services/catalog/mockData.ts` por datos reales de fabricantes, con fichas versionadas (ver Manual Maestro §18 para el formato de metadatos sugerido).
- [ ] Buscador/filtro server-side cuando el catálogo crezca más allá de lo manejable en cliente.

## Calidad y tooling

- [ ] Configurar ESLint + Prettier (o Biome). Sigue sin existir linter configurado.
- [ ] Configurar Vitest + Testing Library y agregar pruebas unitarias a `services/calculations/*` (los ejemplos numéricos de `GUIA_PRACTICA_...md` ya sirven de fixtures).
- [ ] Configurar CI (GitHub Actions) para correr `npm run build` en cada PR antes de fusionar a `main`.

## UX pendiente

- [ ] Formularios de creación de cliente/proyecto son minimalistas (crean con valores por defecto y navegan a edición); reemplazar por un modal/wizard cuando haya tiempo de diseño dedicado.
- [ ] Confirmaciones de eliminación (`Repository.remove`) no tienen diálogo de confirmación en la UI todavía.
- [ ] Mensaje de error de `ReportsTab` es texto plano; migrar a un componente de notificación/toast reutilizable.
