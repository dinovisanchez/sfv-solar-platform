# Arquitectura — SFV Solar Platform

Este documento explica las decisiones de arquitectura del frontend: cómo está organizado hoy y qué se retiró deliberadamente al pivotar de "plataforma SaaS multiempresa" a "herramienta de simulación fotovoltaica enfocada".

## 1. Principio rector

**Los componentes de UI no contienen lógica de ingeniería.** Todo cálculo (dimensionamiento, financiero, batería, recomendación de equipos, layout físico) vive en `src/services/*` como funciones puras sin estado de React, testeables de forma aislada. Las páginas solo orquestan: leen inputs del usuario, llaman a los servicios, muestran el resultado.

Las integraciones externas que todavía no existen (mapas, recurso solar, exportación) se expresan como interfaces en `src/interfaces/*` con una implementación "stub" que falla explícitamente en vez de simular datos falsos — así ninguna pantalla puede mostrar un número inventado creyendo que es real.

## 2. Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Rutas | `src/routes` | Mapear URL → layout → página. `ProtectedRoute` existe pero no está en uso — el dashboard es de acceso libre por decisión de producto (ver §3) |
| Layouts | `src/layouts` | Cascarón visual compartido (público, auth, dashboard) |
| Pages | `src/pages` | Composición de una pantalla a partir de components + hooks + services |
| Components | `src/components` | UI reutilizable, sin acceso directo a datos (reciben props) |
| Hooks | `src/hooks` | Puente entre componentes y contexto (tema, sesión) |
| Context | `src/context` | Estado global transversal (tema, sesión opcional) |
| Services | `src/services` | Lógica de ingeniería y catálogo, sin JSX |
| Models / Interfaces | `src/models`, `src/interfaces` | Contratos de dominio, sin dependencias de React |
| Config / Constants | `src/config`, `src/constants` | Datos de configuración y textos, no lógica |

## 3. Dashboard de acceso libre (sin muro de login)

Por decisión de producto, `/app/*` no requiere autenticación: `AppRoutes.tsx` monta `DashboardLayout` directamente, sin envolverlo en `ProtectedRoute`.

- La plataforma no se piensa como "una página para crear cuentas primero" — el valor (simular, consultar el asistente, explorar el catálogo) está disponible de inmediato.
- `AuthContext` sigue existiendo y `user` puede ser `null` en cualquier momento; los componentes que lo leen (`Topbar`, `OverviewPage`, `ProfilePage`) degradan con gracia a un estado "invitado".
- Login/registro/recuperar contraseña (`src/pages/auth`) siguen existiendo y funcionando (mock local) para quien quiera personalizar su sesión — nunca fueron un requisito.
- `ProtectedRoute.tsx` no se eliminó: queda como el punto de enganche si algún día existe backend real y se decide exigir sesión.

## 4. Asistente IA local sobre los manuales (sin backend, sin LLM externo)

`src/services/assistant/` implementa un asistente de preguntas y respuestas que corre enteramente en el navegador:

1. **`knowledgeBase.ts`** importa `MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md` y `GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md` con el sufijo `?raw` de Vite (se inlinean como texto en el bundle en build-time) y los parte en secciones por encabezado `##`/`###`. Las subsecciones tipo "Paso 1: ...", "Paso 2: ..." (procedimientos numerados dentro de un mismo tema, ej. "6. Como diseñar strings") se vuelven a fusionar en la sección padre (`mergeStepSections`) — separadas, la fórmula y el ejemplo numérico quedaban aislados en una sección que casi nunca ganaba la búsqueda; fusionadas, la respuesta incluye el procedimiento completo.
2. **`search.ts`** tokeniza la pregunta y el contenido en palabras reales (minúsculas, sin tildes, sin stopwords), aplica un stem por prefijo (une variantes como conectar/conector/conectores) y expande la consulta con grupos de sinónimos de dominio (panel/módulo, conectar/string/serie, batería/acumulador, etc.) antes de puntuar por coincidencia de términos en encabezado (peso alto) y contenido (peso menor, con tope).
3. **`formatAnswer.ts`** expone un extracto (hasta ~2000 caracteres, suficiente para casi cualquier sección incluso ya fusionada) y las preguntas sugeridas de la UI.
4. **`AssistantChat.tsx`** (componente reutilizable) muestra la conversación y cada respuesta cita el documento y el encabezado exacto de origen — nunca texto generado, solo lo que el manual dice.

Por qué esta forma y no un LLM real todavía: cualquier recomendación incorrecta sobre dimensionamiento o normativa eléctrica tiene riesgo de seguridad real (ver Manual Maestro §16, "Advertencias técnicas críticas"). Un buscador local sobre fuentes fijas no puede alucinar; un LLM sin RAG estricto y sin backend para ocultar la llave de API, sí. Por la misma razón, cuando se pide una respuesta "más específica", la mejora correcta es mostrar más del texto real de la fuente (secciones completas en vez de fragmentos truncados) — nunca generar una respuesta nueva que no esté literalmente en el manual.

## 5. Simulación: recomendación de equipos, plano 2D y vista 3D

`SimulationPage.tsx` (`/app/simulacion`) orquesta varios servicios puros, todos sin estado de React:

- **`services/calculations/dimensioning.ts`**: kWp requerido y número de paneles a partir de consumo, cobertura y HSP (motor original del MVP).
- **`services/calculations/battery.ts`**: capacidad nominal de batería a partir de energía crítica diaria, días de autonomía y los defaults de DoD/eficiencia/degradación por química.
- **`services/simulation/recommend.ts`**: no inventa equipos — filtra `CATALOG_DATA` (el mismo catálogo de `/app/catalog`) y elige panel/inversor/batería/**transformador** reales que mejor ajustan al requerimiento calculado, devolviendo el arreglo de razones (`reasons: string[]`) que la UI muestra tal cual:
  - Inversor: minimiza la distancia de la relación DC/AC a ~1.15 dentro del rango 0.9–1.35, filtrando por fases compatibles con el tipo de red.
  - Batería: unidades necesarias para cubrir capacidad **y** potencia continua requerida, eligiendo el modelo con menor sobredimensionamiento.
  - Transformador (opcional): kVA requeridos = potencia AC del inversor × margen de seguridad (25%), elige el de menor capacidad que cubra ese requerimiento con las fases correctas.
  - **Configuración de strings** (`recommendStringConfiguration`, nuevo): responde explícitamente "¿serie o paralelo?" — los paneles se conectan en serie dentro de cada string (para sumar tensión) y los strings en paralelo hacia el inversor (para sumar corriente). Calcula paneles por string a partir del Voc corregido por la temperatura mínima del sitio (fórmula de Guía Práctica §6) contra la tensión máxima DC del inversor, valida que el Vmp del string caiga dentro del rango MPPT, y calcula la corriente combinada por entrada MPPT (Isc × 1.25 de margen) contra el máximo admitido — si algo no cumple, lo marca explícitamente (`withinVoltageLimit`, `withinMpptRange`, `withinCurrentLimit`) en vez de sugerir una configuración inválida.
  - **Medición** (`recommendMetering`, nuevo): a partir de la corriente AC estimada del inversor y si hay transformador, recomienda el tipo de medición (directa / semidirecta / indirecta) y el tipo de medidor (siempre bidireccional, por la regulación de generación distribuida). Es una regla general de referencia — el operador de red define el esquema exacto, así lo dice el propio texto de la recomendación.
  - Batería: además de unidades por capacidad/potencia, la razón explica que las unidades se conectan **en paralelo** (mismo bus DC, mismo voltaje nominal) para sumar capacidad — no en serie, salvo que el fabricante lo indique explícitamente.
- **`services/simulation/layout.ts`**: dado un área (techo/patio) y las dimensiones físicas del panel elegido (`PVModule.dimensionsM`), calcula cuántos paneles caben probando ambas orientaciones de montaje, con margen perimetral de acceso. Si no caben todos los paneles requeridos, lo reporta explícitamente (`fits: false`, `missingPanels`) en vez de dibujar un plano incorrecto.
- **`services/simulation/hspByCity.ts`**: tabla de HSP de referencia por ciudad colombiana, marcada como aproximada; editable en la UI.
- **`components/engineering/SystemLayoutDiagram.tsx`**: plano 2D a escala en SVG (vista en planta) — rectángulo del techo/patio con cotas, margen de mantenimiento y la grilla de paneles realmente ubicados.
- **`components/engineering/ArraySceneViewer.tsx`**: vista 3D interactiva con `@react-three/fiber` + `@react-three/drei`. Dibuja el mismo resultado de `layout.ts` pero en volumen: los paneles se inclinan según el ángulo indicado y el grupo completo rota según el azimut (orientación). Cada equipo (arreglo, inversor, batería, transformador) se pasa como un objeto `EquipmentInfo { label, detail, color }` — `label` es el modelo real del catálogo y `detail` es su dato clave (kWp + producción mensual para el arreglo, kW AC + relación DC/AC para el inversor, kWh útiles para la batería, kVA para el transformador), mostrado en una etiqueta flotante (`Html` de drei) sobre cada marcador. Cámara orbital (`OrbitControls`) para rotar y hacer zoom.
- **`components/engineering/SingleLineDiagram.tsx`**: diagrama unifilar en SVG — cadena Arreglo FV → Protecciones DC → Inversor → Protecciones AC → (Transformador) → Red/Medidor, con la Batería como rama conectada al inversor cuando aplica. El nodo del arreglo muestra la configuración de strings (ej. "2× 12 en serie"), el nodo final muestra el tipo de medidor recomendado en vez de un texto genérico. Cada nodo muestra categoría, modelo real y especificación clave (truncados si exceden el ancho de la caja). Es un diagrama de topología, no un plano a escala ni un cálculo de calibre de conductor.
- **`services/simulation/installationFlow.ts`** + **`components/engineering/InstallationFlowDiagram.tsx`** (nuevos): `buildInstallationFlow()` arma la secuencia de pasos de instalación (preparación → estructura → paneles → cableado DC → protecciones → inversor → batería si aplica → protecciones/cableado AC → transformador si aplica → conexión a red → puesta a tierra → comisionamiento), variando el contenido según si hay batería/transformador y si la superficie es techo o patio. `InstallationFlowDiagram` lo renderiza como una línea de tiempo vertical numerada.

**Nota de honestidad técnica**: la vista 3D es una representación esquemática de la disposición y orientación del arreglo, no una simulación solar (no calcula sombras proyectadas por el sol real) ni una vista "4D" en el sentido de BIM (3D + cronograma de obra) — ese alcance sigue pendiente y se documenta en `TODO.md` si se quiere abordar más adelante. El diagrama unifilar tampoco reemplaza un diseño eléctrico certificado: no calcula calibres de conductor ni corrientes de cortocircuito, solo representa la topología con los equipos recomendados.

`SimulationPage` se carga con `React.lazy` en `AppRoutes.tsx` porque Three.js agrega ~235 KB gzip al bundle; así el resto de la app (landing, asistente, catálogo) no paga ese costo si el usuario nunca visita Simulación.

## 6. Integraciones futuras ya con contrato definido

| Integración | Interfaz | Implementación actual |
|---|---|---|
| Mapas (Google Maps / OSM / Mapbox) | `src/interfaces/mapProvider.ts` | Stub que lanza error explicando qué falta (`src/services/maps/mapProvider.ts`) |
| Recurso solar (NASA POWER / PVGIS / Open-Meteo) | `src/interfaces/weatherProvider.ts` | Stub equivalente (`src/services/simulation/weatherProvider.ts`); hoy se usa `hspByCity.ts` como referencia aproximada |
| Exportación PDF / Excel | `src/interfaces/exportProvider.ts` | Stub equivalente (`src/services/export/*.ts`); sin pantalla que los invoque tras retirar "Reportes" |

## 7. Qué se retiró al pivotar de SaaS multiempresa a herramienta enfocada

Una versión anterior de este documento describía una arquitectura preparada para multitenant, roles, licencias/suscripciones, versionado de proyectos, enlaces compartibles y una API REST futura sobre un repositorio genérico (`Repository<T>` + `localStorageRepository`). El usuario pidió simplificar la navegación (quitar Documentación, Clientes, Cotizaciones, Reportes, Mis proyectos y Administrador) para enfocar el producto en Simulación + Asistente + Catálogo. Como consecuencia, se eliminó por completo (no se dejó código muerto):

- `src/pages/dashboard/{ProjectsListPage,ProjectDetailPage,ClientsPage,QuotesPage,ReportsPage,AdminPage,DocsPage}.tsx` y `src/pages/dashboard/project/*` (tabs de proyecto).
- `src/models/{project,client,quote,report}.ts` (se conservó solo `GridType`, movido a `src/models/electrical.ts` porque `SimulationPage` lo sigue usando).
- `src/services/{projects,clients,quotes,storage}/*`, `src/interfaces/repository.ts`, `src/hooks/useRepositoryList.ts`.
- `src/api/{client,endpoints}.ts` (cliente REST genérico, sin nada que lo consumiera).
- `src/components/docs/MarkdownContent.tsx` y la dependencia `marked` (solo la usaba `DocsPage`).
- `src/components/engineering/MapPreviewPlaceholder.tsx` (solo lo usaba la pestaña "General" de proyecto).

Lo que **sí** se conservó porque sigue siendo parte del producto o es de bajo costo mantener:

- `src/interfaces/{tenant,user,subscription}.ts`: `User`/`Role` los sigue usando `AuthContext`; `Plan`/`Subscription`/`License` los sigue mostrando `SettingsPage` (que no se eliminó).
- `src/services/export/*.ts` e `src/interfaces/exportProvider.ts`: no tienen pantalla que los invoque hoy, pero son stubs pequeños y autocontenidos, coherentes con el pedido original de dejar preparada la exportación a PDF/Excel; se retoman si Simulación agrega un botón de exportar más adelante.
- `ProtectedRoute.tsx`: sin uso, pero es el punto de enganche natural si vuelve a haber necesidad de sesión obligatoria.

Si en el futuro se necesita volver a un modelo de proyectos guardados, historial o multiempresa, este documento (versión anterior en el historial de Git) y `ROADMAP.md` tienen el diseño ya pensado — no hay que redescubrirlo, solo reimplementarlo cuando el producto lo pida de nuevo.

## 8. Decisiones explícitas fuera de alcance por ahora

- **No se implementó backend real.**
- **No se implementó PWA** (excluido explícitamente por el usuario).
- **No se conectaron mapas ni clima reales.** Son interfaces con implementación pendiente a propósito.
- **La vista 3D no es una simulación solar ni un BIM 4D** (ver §5) — es una representación esquemática de disposición y orientación.
