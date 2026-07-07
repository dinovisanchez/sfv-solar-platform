# TODO — SFV Solar Platform

Pendientes concretos del estado actual (herramienta de simulación enfocada, sin backend). Ordenados por área, no por prioridad (la priorización vive en `ROADMAP.md`).

## Motor de ingeniería

- [x] ~~Validación de tensión (Voc corregido por temperatura vs. rango MPPT del inversor)~~ — hecho (`recommendStringConfiguration()`), incluye paneles en serie por string y strings en paralelo con validación de corriente por MPPT.
- [ ] Diseño eléctrico detallado: calibre de conductor DC/AC y caída de tensión real (hoy Simulación no lo calcula; sí calcula strings, protecciones y medición a nivel de topología).
- [ ] BOM con cantidades y alternativas compatibles, no solo la lista de texto actual.
- [x] ~~Diagrama unifilar~~ — hecho (`SingleLineDiagram.tsx`), aunque es solo topología: no calcula calibres de conductor ni corrientes de cortocircuito reales.
- [ ] `recommendMetering()` usa un umbral fijo (60 A) y una tensión de referencia fija (220 V) para decidir directa/semidirecta/indirecta — reemplazar por las reglas reales del operador de red cuando se conecte un backend normativo.

## Integraciones externas

- [ ] Conectar un `MapProvider` real (`src/services/maps/mapProvider.ts`) — Google Maps requiere `VITE_GOOGLE_MAPS_API_KEY`, Mapbox requiere `VITE_MAPBOX_TOKEN`, OpenStreetMap/Nominatim no requiere llave.
- [ ] Conectar un `SolarResourceProvider` real (`src/services/simulation/weatherProvider.ts`) — NASA POWER, PVGIS u Open-Meteo, reemplazando `hspByCity.ts` (referencia aproximada).
- [ ] Implementar `pdfExporter` (`src/services/export/pdfExporter.ts`) con una librería real (ej. `@react-pdf/renderer` o `pdf-lib`) — hoy no hay ninguna pantalla que lo invoque tras retirar "Reportes".
- [ ] Implementar `excelExporter` (`src/services/export/excelExporter.ts`) con una librería real (ej. `exceljs`).
- [ ] Ampliar la base del asistente (`src/services/assistant/knowledgeBase.ts`) más allá de los dos manuales — fichas de fabricantes reales, normativa adicional.
- [ ] Evaluar conectar un LLM real (vía backend, nunca con la llave expuesta en el navegador) que use la misma base como contexto (RAG), manteniendo la regla de citar fuente y no inventar valores de ficha técnica.

## Catálogo

- [ ] Reemplazar `services/catalog/mockData.ts` por datos reales de fabricantes, con fichas versionadas (ver Manual Maestro §18 para el formato de metadatos sugerido).
- [ ] Agregar `dimensionsM`/`weightKg` reales (no aproximados) a cada panel a medida que se cargan fichas de fabricantes reales.
- [ ] Agregar más de un fabricante de transformadores/protecciones por rango de potencia para que `recommend.ts` tenga entre qué elegir.

## Simulación y vista 3D

- [ ] `SystemLayoutDiagram`/`ArraySceneViewer` no consideran obstáculos, sombras ni el contorno real del techo — hoy es un rectángulo. El techo/patio real casi nunca es rectangular.
- [ ] La vista 3D no simula la posición del sol ni sombras proyectadas; es una representación esquemática de disposición y orientación, no un análisis de sombreado.
- [ ] Guardar/compartir el resultado de una simulación (hoy se pierde al recargar la página — no hay "proyectos guardados" desde que se retiró esa capa, ver `ARCHITECTURE.md` §7). Si se quiere recuperar esta función, empezar por `localStorage` simple antes de reintroducir un modelo multitenant completo.
- [ ] Pruebas unitarias para `battery.ts`, `layout.ts`, `recommend.ts` e `installationFlow.ts` (mismo criterio que el resto de `services/calculations`).
- [ ] `SingleLineDiagram` es esquemático (topología, no cálculo eléctrico); `InstallationFlowDiagram` es una secuencia de referencia, no un checklist interactivo con evidencia (fotos, mediciones) como se planeó en el Manual Maestro §13 para una fase posterior.

## Calidad y tooling

- [ ] Configurar ESLint + Prettier (o Biome). Sigue sin existir linter configurado.
- [ ] Configurar Vitest + Testing Library y agregar pruebas unitarias a `services/calculations/*` (los ejemplos numéricos de `GUIA_PRACTICA_...md` ya sirven de fixtures).
- [ ] Configurar CI (GitHub Actions) para correr `npm run build` en cada PR antes de fusionar a `main`.
- [ ] El chunk de `SimulationPage` (Three.js) pesa ~235 KB gzip; evaluar `manualChunks` para separar `three` del resto de `@react-three/*` si se agregan más vistas 3D.

## UX pendiente

- [ ] El checkbox nativo de "Necesito batería" / "Incluir transformador" no usa el `Input`/`Select` del sistema de diseño; sería más consistente un componente `Switch` reutilizable.
- [ ] Mensajes de error (ej. catálogo sin equipos compatibles) son texto plano; migrar a un componente de notificación/toast reutilizable si se agregan más flujos con posibilidad de error.
