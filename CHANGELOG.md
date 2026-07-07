# Changelog

Formato libre, en español, orientado a decisiones de producto/arquitectura más que a commits individuales.

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
