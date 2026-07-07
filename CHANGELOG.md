# Changelog

Formato libre, en español, orientado a decisiones de producto/arquitectura más que a commits individuales.

## [0.6.0] — 2026-07-07

### Añadido

- **Etiquetas 3D enriquecidas**: `ArraySceneViewer` ahora recibe un `EquipmentInfo { label, detail, color }` por equipo en vez de un booleano — cada marcador muestra el modelo real y su dato clave (arreglo: kWp + producción mensual; inversor: kW AC + relación DC/AC; batería: kWh útiles totales; transformador: kVA).
- **Diagrama unifilar** (`SingleLineDiagram.tsx`): topología Arreglo FV → Protecciones DC → Inversor → Protecciones AC → (Transformador) → Red/Medidor, con la Batería como rama del inversor, usando los modelos reales de la recomendación.
- **Flujo de instalación** (`services/simulation/installationFlow.ts` + `InstallationFlowDiagram.tsx`): línea de tiempo numerada de pasos de instalación, adaptada según si hay batería, transformador, y si la superficie es techo o patio.

### Cambiado

- `PROJECT_ANALYSIS.md`, `ARCHITECTURE.md`, `ROADMAP.md` y `TODO.md` actualizados con el detalle de estas dos nuevas piezas.

## [0.5.0] — 2026-07-07

### Eliminado (pivote: SaaS multiempresa → herramienta de simulación enfocada)

Pedido explícito del usuario para simplificar la navegación. Se eliminó por completo (sin dejar código muerto):

- Páginas y navegación: Documentación, Clientes, Cotizaciones, Reportes, Mis proyectos (lista y detalle con sus tabs de proyecto), Administrador.
- Modelos: `Project`, `Client`, `Quote`, `Report` (se conservó `GridType`, movido a `src/models/electrical.ts`).
- Servicios: repositorios de proyectos/clientes/cotizaciones, `localStorageRepository`, `useRepositoryList`, cliente REST genérico (`src/api/*`).
- Componentes: `MarkdownContent.tsx` y la dependencia `marked`, `MapPreviewPlaceholder.tsx`.
- `OverviewPage` (Inicio) rediseñado sin depender de proyectos/clientes/cotizaciones.

Ver `ARCHITECTURE.md` §7 para el detalle completo y el razonamiento.

### Añadido

- **Catálogo ampliado**: de 2 paneles/2 inversores/1 batería a 6 paneles, 7 inversores, 5 baterías, y más variedad de controladores/DPS/breakers/fusibles/conductores/estructuras.
- **Transformador de potencia**: nueva categoría de catálogo y modelo `Transformer`; `recommendTransformer()` en `services/simulation/recommend.ts`; toggle "¿Necesita transformador?" en Simulación con recomendación y motivo.
- **Inclinación y orientación** (`tiltDegrees`, `azimuthDegrees`) configurables en Simulación.
- **Vista 3D interactiva** (`ArraySceneViewer.tsx`) con Three.js vía `@react-three/fiber` + `@react-three/drei`: paneles a escala, inclinados y orientados según los parámetros, marcadores de inversor/batería/transformador, cámara orbital (rotar/zoom). Cargada de forma diferida (`React.lazy`) en `AppRoutes.tsx` para no inflar el bundle principal (Three.js queda en un chunk separado de ~235 KB gzip que solo se descarga al entrar a Simulación).

### Cambiado

- Navegación del dashboard reducida a 5 secciones: Inicio, Simulación, Asistente IA, Catálogo, Configuración.
- `PROJECT_ANALYSIS.md`, `ARCHITECTURE.md`, `ROADMAP.md` y `TODO.md` reescritos para reflejar el pivote de producto.

## [0.4.0] — 2026-07-07

### Añadido

- **Página de Documentación** (`/app/documentacion`): tabla de contenidos + buscador sobre el Manual Maestro y la Guía Práctica, con el contenido renderizado como Markdown real (`marked`), no como respuesta de chat. Reutiliza la misma base de conocimiento del asistente (`src/services/assistant/knowledgeBase.ts`).
- **Página de Simulación** (`/app/simulacion`): formulario guiado de consumo, cobertura, ciudad (HSP de referencia editable), tipo de red, respaldo con batería (autonomía, energía y potencia crítica, química) y superficie de instalación (techo/patio con dimensiones). Calcula en vivo:
  - Dimensionamiento FV (motor original reutilizado).
  - Inversor recomendado del catálogo real, con relación DC/AC y motivo explicado.
  - Batería recomendada del catálogo real (si aplica), con capacidad requerida, unidades necesarias y motivo explicado.
  - Lista de elementos que incluye la instalación (paneles, inversor, batería, estructura, protecciones, cableado, puesta a tierra, monitoreo).
  - Plano 2D a escala del arreglo de paneles sobre el techo/patio (`SystemLayoutDiagram`), con aviso explícito si no caben todos los paneles requeridos en el área indicada.
- Nuevos servicios: `services/calculations/battery.ts` (capacidad nominal por autonomía/DoD/eficiencia), `services/simulation/recommend.ts` (selección de inversor/batería del catálogo con justificación), `services/simulation/layout.ts` (paneles que caben físicamente en un área), `services/simulation/hspByCity.ts` (referencia aproximada de HSP por ciudad colombiana).
- `PVModule` ahora incluye `dimensionsM` (ancho/alto en metros) y `weightKg`, necesarios para calcular el layout físico.

### Cambiado

- `PROJECT_ANALYSIS.md`, `ARCHITECTURE.md` (nuevas secciones §12 y §13), `ROADMAP.md` (nueva Fase 0.6) y `TODO.md` actualizados.

## [0.3.0] — 2026-07-05

### Añadido

- **Asistente IA local** (`src/services/assistant/`): búsqueda sobre el Manual Maestro y la Guía Práctica del propio repo, sin backend ni LLM externo. Cita siempre el documento y encabezado de origen; nunca inventa contenido. Disponible en `/app/asistente` y embebido en vivo en la landing (sección "Asistente solar").
- Página `AssistantPage` y entrada "Asistente IA" en la navegación del dashboard.

### Cambiado

- **Dashboard de acceso libre**: se quitó el muro de login. `/app/*` ya no requiere autenticación (`ProtectedRoute` dejó de usarse en `AppRoutes.tsx`, aunque el archivo se conserva para cuando exista backend real). La plataforma no se presenta como "una página para crear cuentas".
- `Navbar`, `Footer`, `Hero`, `Pricing` y `CTASection`: los llamados a la acción ya no apuntan a `/register`, sino directamente a `/app`. Login/registro/perfil quedan como personalización opcional, no como requisito.
- `ProfilePage` degrada con gracia cuando no hay sesión personalizada, en vez de mostrar campos vacíos.
- `PROJECT_ANALYSIS.md`, `ARCHITECTURE.md`, `ROADMAP.md` y `TODO.md` actualizados para reflejar el dashboard abierto y el asistente local.

## [0.2.0] — 2026-07-05

### Añadido

- Migración completa de MVP de una sola calculadora a plataforma SaaS con routing (React Router 6): landing pública, autenticación (mock local), dashboard protegido.
- Sistema de diseño nuevo: modo claro/oscuro persistente, glassmorphism ligero, gradientes de marca, animaciones (`tailwind.config.js`, `src/styles/globals.css`).
- Landing profesional: hero, características, módulos, vista previa de producto (sin capturas ni CDNs de terceros), planes, FAQ, footer.
- Dashboard con: inicio (métricas agregadas), proyectos (crear/listar/detalle con tabs), clientes, cotizaciones, catálogo, reportes, configuración y administrador.
- Detalle de proyecto con tabs de ingeniería: general (cliente/ubicación/coordenadas/estado), dimensionamiento (motor original reutilizado), producción, diseño eléctrico, financiero (VPN/TIR/ROI/payback reales), BOM, diagramas y reportes.
- Catálogo de equipos genérico por categoría (paneles, inversores, baterías, controladores, DPS, breakers, fusibles, conductores, estructuras) con datos mock tipados.
- Arquitectura preparada para: multitenant (`organizationId` en todos los modelos), roles, licencias/suscripciones, versionado de proyectos, enlaces de proyecto compartibles, API REST futura, proveedores de mapas y recurso solar, exportación PDF/Excel.
- Repositorio genérico sobre `localStorage` (`Repository<T>`) para proyectos/clientes/cotizaciones, intercambiable por una API REST sin tocar páginas.
- `render.yaml`, `.env.example` y `README.md` con instrucciones de despliegue en Render (plan gratuito, Static Site).
- `ARCHITECTURE.md` y `TODO.md` nuevos; `PROJECT_ANALYSIS.md` y `ROADMAP.md` actualizados al nuevo estado.

### Cambiado

- `vite.config.ts`: alias `@/` → `src/`.
- `tailwind.config.js`: `darkMode: "class"`, paleta de marca, gradientes, animaciones.
- `package.json`: `vite`, `typescript` y `@vitejs/plugin-react` reclasificados como `devDependencies` (antes estaban incorrectamente en `dependencies`).
- `TaskCard` (heredado del MVP) adaptado a modo oscuro y exportación nombrada.

### Eliminado

- `vite.config.js` y `vite.config.d.ts` (artefactos de compilación residuales, ya cubiertos por `.gitignore`).

## [0.1.0] — 2026-07-05

- Commit inicial: MVP de dimensionador FV preliminar (React + Vite + TypeScript + Tailwind, sin routing ni backend) y manuales de dominio (`MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md`, `GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md`).
