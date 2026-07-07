# SFV Solar Platform

Herramienta web de simulación de ingeniería fotovoltaica para Colombia: dimensiona un sistema, recomienda paneles/inversor/batería/transformador reales con el motivo, y dibuja el arreglo en un plano 2D y una vista 3D interactiva. React + Vite + TypeScript + Tailwind CSS + React Router + Three.js.

> Documentación relacionada: [`PROJECT_ANALYSIS.md`](./PROJECT_ANALYSIS.md) (arquitectura y estado actual), [`ARCHITECTURE.md`](./ARCHITECTURE.md) (decisiones técnicas), [`ROADMAP.md`](./ROADMAP.md) (plan de fases), [`TODO.md`](./TODO.md) (pendientes concretos), [`CHANGELOG.md`](./CHANGELOG.md).

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173` (Vite asigna otro puerto si está ocupado).

Scripts disponibles:

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Type-check (`tsc --noEmit`) + build de producción a `dist/` |
| `npm run preview` | Sirve localmente el contenido ya compilado de `dist/` |
| `npm run typecheck` | Solo verificación de tipos, sin build |

## Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo local (no se commitea):

```bash
cp .env.example .env.local
```

| Variable | Uso | Requerida hoy |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL de la futura API REST | No (no hay backend todavía) |
| `VITE_GOOGLE_MAPS_API_KEY` | Geocodificación con Google Maps | No (integración futura) |
| `VITE_MAPBOX_TOKEN` | Geocodificación con Mapbox | No (integración futura) |

Sin estas variables la app funciona completa: no hay backend ni datos persistidos entre sesiones (cada simulación se calcula en memoria), y los módulos de mapas/clima muestran su estado "próximamente".

## Despliegue en Render (plan gratuito)

Este repo incluye [`render.yaml`](./render.yaml) listo para un **Static Site** de Render.

### Opción A: Blueprint automático

1. En Render, ve a **New > Blueprint**.
2. Conecta este repositorio de GitHub (`dinovisanchez/sfv-solar-platform`).
3. Render detecta `render.yaml` y propone el servicio `sfv-solar-platform` en el plan **Free**.
4. Confirma y despliega.

### Opción B: Static Site manual

1. En Render, ve a **New > Static Site**.
2. Conecta el repositorio y la rama `main`.
3. Configura:
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Agrega las variables de entorno de la tabla anterior si vas a usarlas (pueden dejarse vacías).
5. En **Redirects/Rewrites**, agrega una regla `/*` → `/index.html` (tipo *Rewrite*) para que las rutas de React Router funcionen al refrescar o compartir un enlace directo (ya viene incluida en `render.yaml`).

### Notas del plan gratuito

- Render Free para *Static Sites* no tiene costo y no requiere tarjeta.
- El sitio puede entrar en cold start tras inactividad prolongada según el plan vigente de Render; para un sitio estático esto afecta poco porque no hay servidor persistente.
- Si más adelante se agrega el backend (FastAPI, ver `ARCHITECTURE.md`), ese servicio sí tendrá cold start en el plan free y deberá desplegarse como un **Web Service** aparte.

## Estructura del proyecto

Ver `ARCHITECTURE.md` para el detalle de carpetas (`components`, `pages`, `layouts`, `hooks`, `services`, `models`, `interfaces`, `context`, etc.), cómo está compuesta la Simulación (dimensionamiento, recomendación de equipos, plano 2D y vista 3D) y qué se retiró al simplificar la navegación.
