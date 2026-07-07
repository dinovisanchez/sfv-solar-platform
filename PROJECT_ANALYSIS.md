# Análisis del Proyecto — SFV Solar Platform

Fecha de esta versión: 2026-07-07 (tras simplificar la navegación y agregar transformador + vista 3D).
Rol: Arquitecto de Software Senior / UX-UI Designer Senior / Ingeniero Especialista en Sistemas Fotovoltaicos.

> Esta es la versión vigente del análisis. Versiones anteriores (MVP de una sola calculadora, y luego una plataforma SaaS con proyectos/clientes/cotizaciones/documentación/administrador) quedaron documentadas en `CHANGELOG.md` y en el historial de Git.

---

## 1. Resumen del proyecto

`sfv-solar-platform` es una herramienta enfocada de **simulación de ingeniería fotovoltaica** para Colombia: consumo → dimensionamiento → recomendación real de equipos (panel, inversor, batería, transformador) con el motivo explicado → plano 2D a escala → vista 3D interactiva. Es una SPA (React + Vite + TypeScript + Tailwind + React Router), sin backend, de acceso libre (sin cuenta obligatoria).

El producto se simplificó deliberadamente: se retiraron las secciones de gestión tipo CRM (proyectos, clientes, cotizaciones, reportes, administrador) y la página de documentación separada, para concentrar la experiencia en cuatro superficies: **Simulación**, **Asistente IA**, **Catálogo de equipos** y **Configuración**. La arquitectura multitenant/roles/licencias que se había preparado para el escenario SaaS se retiró junto con esas páginas (ver `ARCHITECTURE.md` §1 y `CHANGELOG.md` para el detalle de qué se eliminó y por qué).

El motor de cálculo original (dimensionamiento HSP × PR) se conserva en `src/services/calculations/dimensioning.ts` y sigue siendo el corazón de Simulación.

## 2. Arquitectura

```
Rutas (src/routes/AppRoutes.tsx)
  → Layouts (Public / Auth / Dashboard)
    → Pages (landing, auth, dashboard: Inicio/Simulación/Asistente/Catálogo/Configuración/Perfil)
      → Components (ui / layout / landing / dashboard / engineering / assistant)
        → Hooks (useAuth, useTheme, useLocalStorage)
          → Services (calculations, catalog, simulation, assistant, maps, export)
            → Models / Interfaces (contratos de dominio, independientes de la UI)
```

No hay backend ni persistencia de datos de negocio (no hay "proyectos" que guardar): cada visita a Simulación es un cálculo en memoria a partir de lo que el usuario ingresa. Lo único persistido en `localStorage` es el tema (claro/oscuro) y, si el usuario lo decide, una sesión local opcional (`AuthContext`).

## 3. Estructura de carpetas

```
src/
├── components/
│   ├── ui/            Button, Card, Badge, Input, Select, Tabs, StatCard, DataTable, EmptyState, ThemeToggle, Logo
│   ├── layout/         Navbar, Footer, Sidebar, Topbar
│   ├── landing/        Hero, Features, Modules, AssistantSection, Screenshots, Pricing, FAQ, CTASection
│   ├── dashboard/       DashboardPage (wrapper), TaskCard (heredado del MVP, adaptado a dark mode)
│   ├── engineering/     NumberSliderField, SystemLayoutDiagram (plano SVG 2D), ArraySceneViewer (vista 3D con Three.js),
│   │                     SingleLineDiagram (unifilar SVG), InstallationFlowDiagram (línea de tiempo de instalación)
│   └── assistant/       AssistantChat.tsx (chat reutilizable, landing + dashboard)
├── config/            site.ts (contenido de landing/nav/planes/FAQ), env.ts
├── constants/          routes.ts, navigation.ts
├── context/            ThemeContext, AuthContext
├── hooks/               useTheme, useAuth, useLocalStorage
├── interfaces/          tenant, user, subscription, mapProvider, weatherProvider, exportProvider
├── layouts/             PublicLayout, AuthLayout, DashboardLayout
├── models/              catalog.ts (PVModule/Inverter/Battery/Transformer/...), electrical.ts (GridType)
├── pages/
│   ├── landing/HomePage.tsx
│   ├── auth/            LoginPage, RegisterPage, ForgotPasswordPage (opcionales, no bloquean nada)
│   ├── dashboard/        OverviewPage, SettingsPage, ProfilePage, AssistantPage, SimulationPage
│   ├── catalog/CatalogListPage.tsx (genérico, parametrizado por categoría)
│   └── misc/NotFoundPage.tsx
├── routes/              AppRoutes.tsx, ProtectedRoute.tsx (sin uso hoy, listo para backend futuro)
├── services/
│   ├── calculations/     dimensioning.ts (motor original), financial.ts (VPN/TIR/payback/ROI), battery.ts (capacidad por autonomía/DoD/eficiencia)
│   ├── catalog/           categories.ts, mockData.ts (paneles, inversores, baterías, transformadores, protecciones, conductores, estructuras)
│   ├── export/            pdfExporter.ts, excelExporter.ts (interfaz lista, implementación pendiente)
│   ├── maps/               mapProvider.ts (Google/OSM/Mapbox, interfaz lista, pendiente)
│   ├── simulation/         weatherProvider.ts (pendiente), hspByCity.ts (referencia aproximada),
│   │                       layout.ts (paneles que caben en un área), recommend.ts (elige panel/inversor/
│   │                       batería/transformador del catálogo, arma el porqué, y calcula la configuración
│   │                       de strings serie/paralelo y el tipo de medición), installationFlow.ts
│   │                       (secuencia de pasos de instalación según batería/transformador/superficie)
│   └── assistant/          knowledgeBase.ts, search.ts, formatAnswer.ts — asistente local sobre los manuales
├── styles/globals.css     Tailwind + tokens de tema claro/oscuro + glassmorphism + animaciones
├── types/common.ts        Id, Timestamps, Paginated<T>, ApiResult<T>, SelectOption
└── utils/                 cn.ts, formatters.ts
```

## 4. Tecnologías

- **React 18 + TypeScript 5.8 (strict)**.
- **Vite 7** con alias `@/` → `src/`.
- **React Router 6**, con `SimulationPage` cargada de forma diferida (`React.lazy`) para que Three.js no infle el bundle principal.
- **Tailwind CSS 3** con `darkMode: "class"`, paleta de marca, gradientes y animaciones propias.
- **three + @react-three/fiber + @react-three/drei**: vista 3D interactiva del arreglo de paneles (rotar/zoom con `OrbitControls`).
- **clsx**, **lucide-react**.
- Sin dependencias de servicios de terceros con datos reales todavía (mapas, clima, PDF/Excel son interfaces sin implementar). El asistente IA es la excepción: es una funcionalidad real hoy, pero local (búsqueda sobre los manuales embebidos en el bundle vía `?raw`), sin llamar a ningún servicio externo.

## 5. Flujo de funcionamiento

```
Visitante → Landing (/) → "Abrir la plataforma" → /app (sin login, acceso libre)
  → Inicio: accesos directos a Simulación, Asistente y Catálogo + conteo de equipos disponibles
  → Simulación: consumo, cobertura, ciudad (HSP de referencia editable), tipo de red, panel de referencia,
      temperatura mínima del sitio
      → ¿Batería? autonomía, energía y potencia crítica, química
      → ¿Transformador? se dimensiona a partir de la potencia AC del inversor recomendado
      → Techo o patio: ancho, largo, inclinación, orientación/azimut
      → Resultado en vivo: kWp y paneles, inversor recomendado (con motivo), configuración de strings
        (paneles en serie por string, strings en paralelo, con motivo), batería recomendada (con motivo,
        conexión en paralelo), transformador recomendado (con motivo), medición recomendada (directa/
        semidirecta/indirecta + medidor), lista de elementos de la instalación, diagrama unifilar
        (arreglo → protecciones DC → inversor → protecciones AC → transformador → medidor/red, batería
        como rama), flujo de instalación paso a paso, plano 2D a escala (con aviso si no caben todos los
        paneles) y vista 3D interactiva con marcadores etiquetados (modelo + producción/
        potencia/capacidad) de inversor/batería/transformador
  → Asistente IA: preguntas libres respondidas solo con el Manual Maestro y la Guía Práctica (sin LLM externo)
  → Catálogo: paneles, inversores, baterías, transformadores, controladores, DPS, breakers, fusibles,
    conductores, estructuras
  → Configuración, Perfil
  → (Opcional) Login/Registro: personalizar nombre/rol de la sesión local, no es requisito
```

## 6. Estado actual

| Aspecto | Estado |
|---|---|
| Routing | Completo: landing pública, auth opcional, dashboard de acceso libre (5 secciones) |
| Dark/Light mode | Completo, persistente en `localStorage` |
| Autenticación | Mock local, opcional, no bloquea nada |
| Simulación | Funcional de punta a punta: dimensionamiento, inversor/batería/transformador reales del catálogo con motivo, lista de elementos de instalación, diagrama unifilar, flujo de instalación, plano 2D y vista 3D con etiquetas de producción/capacidad |
| Asistente IA | Funcional: búsqueda local sobre el Manual Maestro y la Guía Práctica, siempre cita la fuente |
| Catálogo de equipos | Funcional, ampliado: 6 paneles, 7 inversores, 5 baterías, 6 transformadores y variedad de protecciones/conductores/estructuras |
| Vista 3D | Funcional: paneles inclinados/orientados según los parámetros, marcadores etiquetados (modelo + dato clave) de inversor/batería/transformador, cámara orbital. Es una representación esquemática (no simula sombras solares reales ni una línea de tiempo de construcción) |
| Diagrama unifilar | Funcional: topología arreglo → protecciones DC → inversor → protecciones AC → (transformador) → red/medidor, con batería como rama, usando los modelos reales recomendados |
| Flujo de instalación | Funcional: secuencia de pasos generada según si hay batería/transformador y el tipo de superficie |
| Configuración de strings (serie/paralelo) | Funcional: paneles en serie por string (Voc corregido por temperatura vs. límite DC del inversor, Vmp dentro del rango MPPT) y strings en paralelo (corriente por MPPT vs. máximo), con motivo explicado |
| Medición y punto de conexión | Funcional: tipo de medición (directa/semidirecta/indirecta) según corriente AC estimada y presencia de transformador, con medidor bidireccional recomendado |
| Mapas / recurso solar / export PDF-Excel | Interfaces y stubs listos; sin proveedor real conectado |
| Despliegue | `render.yaml` + README listos para Render Free (Static Site) |
| Tests / CI | Siguen sin existir (ver `TODO.md`) |

Ver `ARCHITECTURE.md` para el detalle de qué se retiró en el pivote de "SaaS multiempresa" a "herramienta de simulación enfocada", y `ROADMAP.md` para el plan de fases.
