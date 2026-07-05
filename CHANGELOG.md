# Changelog

Formato libre, en español, orientado a decisiones de producto/arquitectura más que a commits individuales.

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
