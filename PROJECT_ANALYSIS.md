# Análisis del Proyecto — SFV Solar Platform

Fecha del análisis: 2026-07-05
Rol: Arquitecto de Software Senior / Ingeniero Especialista en Sistemas Fotovoltaicos.

Alcance: análisis estático completo del repositorio (todo el código fuente, configuración y documentación existente, excluyendo `node_modules`, `dist`, `.git`). No se modificó ningún archivo durante este análisis.

---

## 1. Resumen del proyecto

`sfv-solar-platform` es, en su estado actual, un **MVP de un único componente**: una calculadora de dimensionamiento solar fotovoltaico preliminar, envuelta en una landing page de una sola pantalla. El código corresponde casi exactamente a la sección "Primer módulo de software que conviene construir" descrita en `GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md` (sección 14): consumo mensual → cobertura objetivo → HSP → número de paneles → relación DC/AC → energía mensual estimada.

El repositorio contiene, sin embargo, una **visión mucho más amplia** documentada en dos manuales Markdown extensos (43 KB combinados) que describen la plataforma objetivo: un sistema profesional de ingeniería FV para Colombia con dimensionamiento completo (paneles, inversores, baterías, protecciones, cableado), cumplimiento normativo (RETIE, NTC 2050, IEC, UL, IEEE), simulación energética, generación de BOM, diagramas unifilares, análisis financiero, asistente de instalación guiada y un asistente de IA con RAG sobre documentación oficial.

**Estado real vs. visión documentada: brecha muy grande.** El código implementado cubre aproximadamente el 2-3% del alcance descrito en los manuales. Es, en esencia, un prototipo visual/UX (probablemente generado con una herramienta de diseño AI, dado el video de fondo y los avatares alojados en un CDN externo `higgs.ai`) que valida la fórmula de dimensionamiento básica, no una plataforma de ingeniería.

## 2. Arquitectura

Arquitectura actual: **SPA de una sola página, sin backend, sin persistencia, sin routing.**

```
┌─────────────────────────────┐
│         index.html          │  ← punto de entrada Vite
└──────────────┬───────────────┘
               │
        src/main.tsx           ← monta React en #root (StrictMode)
               │
         src/App.tsx           ← TODO el estado y TODA la lógica de negocio
               │                  (un único componente de ~500 líneas)
               ├── useState x5 (inputs del formulario)
               ├── useMemo (motor de cálculo inline)
               ├── NumberField (subcomponente local, no exportado)
               ├── AvatarStack (subcomponente local, decorativo)
               ├── CommandItem (subcomponente local, decorativo)
               │
               └── src/components/TaskCard.tsx  ← único componente compartido real
```

No existen: enrutador, cliente HTTP, estado global (Redux/Zustand/Context), capa de servicios, modelos de datos persistentes, tests, linter configurado, ni backend de ningún tipo. Todo el "motor de cálculo" vive en un `useMemo` de 20 líneas dentro de `App.tsx`.

La arquitectura *documentada* (no implementada) en el Manual Maestro, sección 13, propone:
- Frontend: Next.js + React + TypeScript + Three.js (visualización 3D) + Canvas/SVG (unifilares).
- Backend: Python + FastAPI, motor de cálculo propio con pruebas unitarias, pvlib/PySAM para simulación.
- Datos: PostgreSQL + pgvector para RAG.
- Jobs asíncronos: Celery/RQ.
- Autenticación por roles (diseñador, instalador, supervisor, cliente, auditor).

Es decir, el proyecto real hoy es un fragmento de frontend puro; toda la arquitectura de backend, datos, normativa y simulación existe solo como especificación en Markdown.

## 3. Estructura de carpetas y archivos

```
SFV/
├── index.html                                  Entry point HTML (Vite)
├── package.json                                 Manifiesto npm, scripts dev/build/preview
├── package-lock.json
├── vite.config.ts                               Config real (fuente de verdad)
├── vite.config.js / vite.config.d.ts            Artefactos JS compilados residuales (ver IMPROVEMENTS.md)
├── tsconfig.json                                Config TS para src/ (strict: true)
├── tsconfig.node.json                           Config TS para el propio vite.config.ts
├── tsconfig.node.tsbuildinfo / tsconfig.tsbuildinfo   Caches incrementales de TS (no deberían versionarse)
├── tailwind.config.js                            Tailwind apuntando a index.html y src/**/*.{js,ts,jsx,tsx}
├── postcss.config.js                             tailwindcss + autoprefixer
├── .gitignore
├── MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md    Manual técnico-normativo completo (visión de producto)
├── GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md  Guía metodológica paso a paso
├── dist/                                         Build ya generado (index.html + assets JS/CSS hasheados)
├── node_modules/                                 101 paquetes de nivel superior, coherente con package.json
└── src/
    ├── main.tsx                                  Bootstrap de React (createRoot + StrictMode)
    ├── index.css                                 Tailwind directives + estilos globales + keyframes
    ├── App.tsx                                    Único "módulo funcional": UI + estado + cálculo
    └── components/
        └── TaskCard.tsx                           Único componente reutilizable real (tarjeta genérica)
```

No existen carpetas para: `services/`, `hooks/`, `utils/`, `models/`, `types/` (compartidos), `pages/`, `api/`, `tests/`, `lib/`. No hay separación entre lógica de negocio y presentación.

## 4. Explicación de cada módulo

### `index.html`
Metadatos SEO básicos en español, precarga de fuente Google "Instrument Serif", monta `#root` y carga `src/main.tsx` como módulo ES.

### `src/main.tsx`
Bootstrap estándar de Vite + React 18: `ReactDOM.createRoot(...).render(<StrictMode><App/></StrictMode>)`. Sin providers, sin router, sin error boundary.

### `src/App.tsx`
Contiene:
- **Datos hardcodeados de contenido decorativo**: una URL de video de fondo (`backgroundVideo`) y tres URLs de avatar (`avatarUrls`), todas apuntando a un CDN de terceros (`d8j0ntlcm91z4.cloudfront.net`, `images.higgs.ai`) asociado a una cuenta de usuario específica (`user_38xzZboKViGWJOttwIXH07lWA1P`). Esto es contenido de una plantilla/mockup de diseño, no activos propios del proyecto.
- **`AvatarStack`**: componente decorativo que apila avatares circulares.
- **Estado del formulario** (5 `useState`): `monthlyKwh`, `coverage`, `hsp`, `panelW`, `inverterKw`. `performanceRatio` está fijo en `0.8` (no editable, documentado en la UI como "Fijo para esta primera etapa").
- **Motor de cálculo** (`useMemo`): implementa exactamente el pseudocódigo `dimensionarSistema()` de la Guía Práctica sección 14:
  - `dailyConsumption = monthlyKwh / 30`
  - `targetDailyEnergy = dailyConsumption * (coverage / 100)`
  - `requiredKwp = targetDailyEnergy / (hsp * performanceRatio)`
  - `panels = ceil(requiredKwp * 1000 / panelW)`
  - `realDcKwp = panels * panelW / 1000`
  - `dcAcRatio = realDcKwp / inverterKw`
  - `estimatedMonthly = realDcKwp * hsp * performanceRatio * 30`
- **`efficiencyScore`**: `min(99, round(estimatedMonthly / monthlyKwh * 100))`, mostrado como "Cobertura estimada del consumo".
- **UI**: header con navegación ficticia (anclas `#dimensionador`, `#instalacion`, `#normas`, `#ia` sin contenido real detrás salvo `#dimensionador` y las dos tarjetas con esos ids), tarjetas de resultado (`TaskCard`) para "Arreglo fotovoltaico", "Compatibilidad inversor" e "Instalación guiada", panel lateral con "Comandos rápidos" (decorativo, sin funcionalidad) y un bloque de "Asistente solar" con un mock de forma de onda de audio (estático, sin grabación real) y un botón de micrófono sin handler.
- **`NumberField`**: input numérico + slider sincronizados, únicos controles interactivos reales de la app.
- **`CommandItem`**: fila de comando con botón "play" sin handler (decorativo).

### `src/components/TaskCard.tsx`
Único componente genuinamente reutilizable. Tarjeta con icono, título, tag de color (`green|yellow|red|blue`), hasta 3 pares detalle label/value, contenido inferior izquierdo arbitrario (`ReactNode`) y botón con 3 variantes de estilo. Bien tipado con TypeScript, sin lógica de negocio.

### `src/index.css`
Directivas Tailwind + reset mínimo + fuente serif de despliegue + animación `fadeUp` usada en casi todos los bloques de `App.tsx` + estilo de acento para `input[type=range]`.

### Documentación (`.md`)
- **`MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md`**: manual normativo-técnico de referencia (RETIE, NTC 2050, IEC/UL/IEEE, tipos de sistema, componentes, fórmulas de dimensionamiento, procedimiento de instalación, comisionamiento, O&M, biblioteca de fallas, arquitectura de plataforma objetivo, modelo de datos, motor de reglas, roadmap de 5 fases). Es la fuente de verdad conceptual del dominio.
- **`GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md`**: guía metodológica paso a paso con ejemplos numéricos didácticos (los mismos números que terminaron implementados en `App.tsx`) y mockups de las 6 pantallas que debería tener el frontend.

Ambos documentos son de **alta calidad como especificación de dominio**, pero no son documentación del código existente (no describen `TaskCard`, ni la estructura real de carpetas, ni decisiones técnicas tomadas). Son visión de producto, no ADRs ni documentación de arquitectura del código actual.

## 5. Flujo de funcionamiento (estado actual)

```
Usuario abre la SPA
  -> ve video de fondo + header + tarjeta "Hola, ingeniero"
  -> ajusta 5 controles (consumo, cobertura, HSP, W panel, kW inversor)
  -> useMemo recalcula instantáneamente en el cliente (sin red, sin backend)
  -> se re-renderizan: % de cobertura estimada, métricas del sistema (kWp DC, paneles, DC/AC),
     tarjeta de arreglo FV, tarjeta de compatibilidad de inversor (con alerta visual si DC/AC > 1.35),
     tarjeta de instalación guiada (checklist estático, no interactivo)
  -> el resto de la UI (comandos rápidos, asistente de voz, "siguiente fase") es enteramente decorativo,
     sin estado ni efecto
```

No hay persistencia entre sesiones (todo el estado se pierde al recargar), no hay guardado de proyectos, no hay exportación de nada, no hay llamadas de red salvo la carga de assets estáticos (video, imágenes, fuente).

## 6. Dependencias importantes

**Producción** (`dependencies`):
| Paquete | Versión | Rol |
|---|---|---|
| `react` / `react-dom` | ^18.3.1 | UI |
| `vite` | ^7.0.0 | Bundler/dev server — colocado en `dependencies` en vez de `devDependencies` |
| `@vitejs/plugin-react` | ^5.0.0 | Fast Refresh / JSX — también debería ser dev dependency |
| `typescript` | ^5.8.0 | Igual, herramienta de build, no runtime |
| `lucide-react` | ^0.468.0 | Iconografía SVG |

**Desarrollo** (`devDependencies`):
| Paquete | Versión | Rol |
|---|---|---|
| `tailwindcss` | ^3.4.17 | Utilidades CSS |
| `postcss` / `autoprefixer` | ^8.5.0 / ^10.4.20 | Pipeline CSS |
| `@types/react`, `@types/react-dom` | — | Tipado |

No hay: router, cliente HTTP (fetch nativo bastaría, pero no hay llamadas), gestor de estado, librería de formularios/validación, librería de gráficos/dashboards, testing framework (Jest/Vitest/Testing Library), linter (ESLint) ni formateador (Prettier) configurados.

## 7. Tecnologías utilizadas

- **React 18** (function components, hooks: `useState`, `useMemo`).
- **TypeScript 5.8** en modo `strict`, `noEmit` (el build real lo hace Vite/esbuild, tsc solo verifica tipos).
- **Vite 7** como bundler y dev server, plugin oficial de React.
- **Tailwind CSS 3** + PostCSS + Autoprefixer para estilos utilitarios.
- **lucide-react** para iconos SVG.
- Fuente externa Google Fonts ("Instrument Serif").
- Sin backend, sin base de datos, sin IA integrada (a pesar de la sección "Asistente solar" en la UI, que es puramente visual/mock).

## 8. Estado actual del proyecto

| Aspecto | Estado |
|---|---|
| Control de versiones | Repositorio Git inicializado (`main`), **sin ningún commit todavía** — todo el árbol de trabajo está sin trackear |
| Build | Compila y pasa el chequeo de tipos sin errores (`npx tsc --noEmit` limpio); existe un `dist/` ya generado |
| Tests | Ninguno |
| CI/CD | Ninguno |
| Linting | Ninguno configurado |
| Funcionalidad de negocio | Solo el cálculo preliminar de dimensionamiento (fórmula simple, sin validación normativa, sin fichas técnicas reales) |
| Persistencia | Ninguna (todo en memoria del cliente) |
| Backend/API | Inexistente |
| Cumplimiento normativo (RETIE/NTC 2050) | No implementado en código; solo mencionado como texto estático en un panel ("Siguiente fase") |
| Documentación de dominio | Extensa y de buena calidad (dos manuales), pero desconectada del código |

**Conclusión de estado**: proyecto en fase de **prototipo visual inicial (MVP de una sola calculadora)**, con una especificación de producto muy madura y ambiciosa ya redactada, pero con menos del 5% de esa especificación llevada a código. El primer commit de Git ni siquiera se ha realizado.

Ver `IMPROVEMENTS.md` para hallazgos técnicos detallados y `ROADMAP.md` para el plan de desarrollo propuesto hacia la plataforma completa descrita en los manuales.
