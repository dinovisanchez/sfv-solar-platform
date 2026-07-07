# Roadmap de desarrollo — SFV Solar Platform

Fecha: 2026-07-05 (actualizado tras la migración a plataforma SaaS). Plan de desarrollo hacia la plataforma profesional de diseño e ingeniería de sistemas fotovoltaicos para Colombia descrita en `MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md` y `GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md`.

Este roadmap prioriza: (1) consolidar y sanear la base actual, (2) construir el motor de cálculo de ingeniería con validación normativa real, (3) construir la plataforma alrededor de ese motor. No se recomienda empezar por el frontend visual 3D antes de tener un motor de cálculo correcto y auditable.

---

## Fase 0: Saneamiento de la base actual — ✅ Completada (2026-07-05)

- [x] Primer commit de Git.
- [x] Eliminados `vite.config.js` / `vite.config.d.ts` residuales; solo queda `vite.config.ts`.
- [x] `vite`, `@vitejs/plugin-react`, `typescript` reclasificados como `devDependencies`.
- [x] Motor de cálculo extraído a `src/services/calculations/dimensioning.ts` (módulo puro).
- [ ] ESLint + Prettier (o Biome) — pendiente, ver `TODO.md`.
- [ ] Framework de testing (Vitest) — pendiente, ver `TODO.md`.
- [x] Assets decorativos de terceros (video/avatares del MVP original) retirados en el nuevo diseño; la landing ya no depende de un CDN ajeno.

## Fase 0.5: Migración a plataforma SaaS (frontend) — ✅ Completada (2026-07-05)

No estaba en la versión anterior de este roadmap; se ejecutó como un salto explícito pedido por el usuario para tener una base de producto completa antes de profundizar en el motor de ingeniería. Incluyó:

- [x] Routing completo (React Router 6): landing pública, auth, dashboard.
- [x] Sistema de diseño nuevo con modo claro/oscuro, glassmorphism, gradientes y animaciones.
- [x] Dashboard con proyectos, clientes, cotizaciones, catálogo, reportes, configuración, administrador.
- [x] Arquitectura preparada para multitenant, roles, licencias/suscripciones, versionado y compartir proyectos (modelos e interfaces, sin backend real todavía — ver `ARCHITECTURE.md`).
- [x] Repositorio genérico intercambiable `localStorage` ↔ API REST (`Repository<T>`).
- [x] Interfaces listas (sin implementación real) para mapas, recurso solar y exportación PDF/Excel.
- [x] `render.yaml` + README para despliegue en Render Free.
- [x] **Dashboard de acceso libre**: se quitó el muro de login (`/app` ya no exige sesión) por decisión de producto — la plataforma no es "una página para crear cuentas", ver `ARCHITECTURE.md` §10.
- [x] **Asistente IA local**: búsqueda sobre el Manual Maestro y la Guía Práctica, sin backend ni LLM externo, siempre cita la fuente (`src/services/assistant`, ver `ARCHITECTURE.md` §11). Disponible en `/app/asistente` y embebido en la landing.

Esta fase adelanta parte de lo que antes era "Fase 4" (routing real, panel de proyecto) y parte de "Fase 5" (arquitectura multitenant, roles) y de "Funcionalidades futuras" (asistente IA). Las secciones siguientes se ajustaron para no duplicar ese trabajo.

## Fase 0.6: Documentación navegable y Simulación con recomendación de equipos — ✅ Completada (2026-07-07)

Pedido explícito del usuario: una página de información navegable (no solo un chat) y un simulador que pida los datos del proyecto, recomiende batería/inversor reales con justificación, y dibuje el arreglo de paneles a escala sobre el techo o patio indicado.

- [x] **Documentación** (`/app/documentacion`): TOC + buscador sobre las mismas ~80 secciones del asistente, contenido renderizado como Markdown real (`marked`), no solo texto plano. Ver `ARCHITECTURE.md` §12.
- [x] **Simulación** (`/app/simulacion`): formulario de consumo, cobertura, ciudad (HSP de referencia editable), tipo de red, respaldo con batería (autonomía/energía crítica/potencia crítica/química) y superficie de instalación (techo/patio + dimensiones).
- [x] Dimensionamiento reutiliza el motor original; nuevo motor de baterías (`services/calculations/battery.ts`) con la fórmula de capacidad nominal por autonomía/DoD/eficiencia.
- [x] Recomendación real de inversor y batería desde el catálogo existente (`services/simulation/recommend.ts`), con el porqué explicado en texto (relación DC/AC, fases, capacidad/potencia cubierta, química, certificaciones) — no una sugerencia genérica.
- [x] Plano 2D a escala del arreglo de paneles (`SystemLayoutDiagram.tsx` + `services/simulation/layout.ts`): calcula filas/columnas que caben físicamente en el área dada (con margen de mantenimiento) y avisa explícitamente si no caben todos los paneles requeridos, en vez de dibujar algo incorrecto.
- [x] Lista de "elementos que incluye la instalación" (paneles, inversor, batería si aplica, estructura según techo/patio, protecciones DC/AC, cableado, puesta a tierra, monitoreo) generada a partir del propio resultado, no un texto fijo.

> **Actualización (2026-07-07)**: la página de Documentación descrita arriba se retiró en la Fase 0.7 al simplificar la navegación. El "conectar Simulación a un proyecto guardado" también quedó sin objeto porque el concepto de "proyecto guardado" se retiró en la misma fase. Ver Fase 0.7 y `ARCHITECTURE.md` §7 para el detalle de qué se quitó y por qué.

## Fase 0.7: Simplificación de navegación + catálogo ampliado + transformador + vista 3D — ✅ Completada (2026-07-07)

Pedido explícito del usuario: quitar del producto las secciones de gestión tipo CRM (Documentación, Clientes, Cotizaciones, Reportes, Mis proyectos, Administrador) para enfocar la plataforma en Simulación + Asistente + Catálogo; ampliar el catálogo; agregar la opción de incluir un transformador de potencia con recomendación; y llevar la visualización del arreglo a una vista 3D interactiva.

- [x] **Navegación reducida a 5 secciones**: Inicio, Simulación, Asistente IA, Catálogo, Configuración (+ Perfil vía el avatar). Se eliminó por completo el código de Documentación, Clientes, Cotizaciones, Reportes, Mis proyectos y Administrador (páginas, modelos, repositorios, cliente REST genérico) — no quedó código muerto. Detalle en `ARCHITECTURE.md` §7.
- [x] **Inicio (`OverviewPage`) rediseñado** sin depender de proyectos/clientes/cotizaciones: accesos directos a Simulación/Asistente/Catálogo y conteo real de equipos del catálogo.
- [x] **Catálogo ampliado**: de 2 paneles/2 inversores/1 batería a 6 paneles, 7 inversores, 5 baterías, más variedad de controladores/DPS/breakers/fusibles/conductores/estructuras.
- [x] **Transformador de potencia**: nueva categoría de catálogo (`transformadores`, modelo `Transformer`), `recommendTransformer()` en `services/simulation/recommend.ts` (kVA requeridos = potencia AC × margen de seguridad), toggle "¿Necesita transformador?" en Simulación con tarjeta de recomendación y motivo.
- [x] **Inclinación y orientación configurables** (`tiltDegrees`, `azimuthDegrees`) en Simulación, usadas tanto en el resumen como en la vista 3D.
- [x] **Vista 3D interactiva** (`ArraySceneViewer.tsx`, Three.js vía `@react-three/fiber` + `@react-three/drei`): paneles inclinados/orientados a escala real, marcadores de inversor/batería/transformador, cámara orbital. Cargada de forma diferida (`React.lazy`) para no inflar el bundle principal.

Ver `ARCHITECTURE.md` §5 y §7 para el detalle técnico y la lista completa de lo retirado.

---

## Fase 1: Base técnica y modelo de datos

Objetivo: construir los cimientos de dominio que hoy no existen — tipos, modelos, biblioteca normativa, sin todavía UI compleja.

- Definir modelos de dominio en TypeScript (y su equivalente de backend cuando exista), siguiendo el modelo de datos ya bosquejado en el Manual Maestro §13:
  `Project`, `Site`, `LoadProfile`, `Tariff`, `PVModule`, `Inverter`, `Battery`, `MountingSystem`, `ProtectionDevice`, `Cable`, `Connector`, `StringDesign`, `ElectricalDesign`, `SimulationRun`, `Rule`, `ManufacturerDocument`, `InspectionChecklist`, `CommissioningTest`, `MaintenanceTicket`, `FaultCode`, `Report`.
- Crear la carpeta de conocimiento estructurada que ya propone el Manual Maestro §18 (`knowledge/00_fuentes` … `14_software`) para almacenar fichas técnicas de fabricantes con metadatos versionados (fabricante, modelo, versión de documento, URL oficial, fecha de consulta, certificaciones, estado de revisión).
- Cargar biblioteca inicial de normas aplicables en Colombia: RETIE (libros I–IV), NTC 2050, resoluciones CREG de generación distribuida/autogeneración, y normas internacionales de referencia (IEC 61215, 61730, 62548, 62446-1, 62109, 61643; IEEE 1547; UL 1741/9540).
- Fichas normalizadas de al menos un fabricante por categoría (panel, inversor, batería) para poder validar el motor de reglas en Fase 2 contra datos reales, no solo ejemplos didácticos.
- Definir esquema de checklist de instalación y de comisionamiento como datos estructurados (no solo texto en Markdown), listos para consumirse desde UI en Fase 4.

**Prioridad: alta.** Sin este modelo, cualquier funcionalidad de cálculo nueva se seguirá construyendo como código desechable dentro de componentes de React, repitiendo el patrón actual.

---

## Fase 2: Motor de cálculo de ingeniería

Objetivo: reemplazar la fórmula preliminar única de hoy por un motor de cálculo completo, versionado y con pruebas unitarias, cubriendo explícitamente lo solicitado:

- **Dimensionamiento de paneles**: número de módulos, configuración de strings, ajuste por área de techo/estructura disponible (ya cubierto parcialmente hoy, generalizar).
- **Dimensionamiento de inversores**: selección por potencia, relación DC/AC, rango MPPT, número de entradas, validación contra ficha técnica real (Voc/Vmp/Isc/Imp corregidos por temperatura vs. límites del inversor — fórmulas ya documentadas en Manual Maestro §6.3–6.5 y Guía Práctica §6).
- **Dimensionamiento de baterías**: energía crítica diaria, autonomía, DoD usable, eficiencia round-trip, degradación (fórmula ya documentada en Manual Maestro §5.3 y Guía Práctica §7).
- **Dimensionamiento de conductores** (DC y AC): por ampacidad, temperatura, agrupamiento y sección.
- **Cálculo de caída de tensión**: DC (fórmula del factor 2 por ida/vuelta, Guía Práctica §8) y AC (monofásica/trifásica, Guía Práctica §9), con objetivo configurable (1–2% DC, 1–3% AC) y trazabilidad del cálculo, no solo un número final.
- **Selección de protecciones eléctricas**: fusibles de string, seccionadores DC/AC, SPD tipo 1/2, diferencial cuando aplique, dimensionamiento de breaker AC por corriente nominal (fórmulas Guía Práctica §9).
- **Cálculo de producción energética**: partir del modelo preliminar HSP×PR actual hacia series horarias/subhorarias reales (integración con PVWatts/pvlib/PySAM como referencia el Manual Maestro §3 y §13), incluyendo pérdidas por temperatura, mismatch, suciedad, sombreado y clipping.
- **Motor de reglas normativas**: implementar como reglas ejecutables (no solo texto) los ejemplos ya definidos en Manual Maestro §13:
  `Vstring_max < Vdc_max_inversor`, `Imp_string <= Imax_MPPT`, `Isc_corr <= Iscmax_MPPT`, compatibilidad de conectores, compatibilidad batería-inversor, límite de exportación por operador de red, vigencia de certificación RETIE de producto.
- Cobertura de pruebas unitarias para cada fórmula, usando los ejemplos numéricos ya presentes en la Guía Práctica como casos de prueba dorados (los números de los documentos ya sirven de fixtures).

**Prioridad: alta — es el corazón técnico del producto y el diferenciador real frente a una calculadora genérica.**

---

## Fase 3: Análisis financiero y documentación generada

Objetivo: cerrar el ciclo de valor para el cliente final, más allá del cálculo eléctrico.

- **Análisis financiero**: ROI, TIR (IRR), VPN (NPV), periodo de retorno simple y descontado, considerando tarifa eléctrica del cliente, degradación anual de producción, costos de O&M y, cuando aplique, ingresos por excedentes según reglas CREG vigentes.
- **Lista de materiales (BOM)**: generación automática a partir del diseño (paneles, inversor, estructura, cableado, protecciones, conectores) con cantidades, marcas/modelos seleccionados y alternativas compatibles.
- **Diagramas unifilares**: representación basada en datos del diseño (SVG/canvas dirigido por el modelo, no dibujo manual), coherente con el diagrama exigido para trámite ante operador de red (Manual Maestro §7).
- **Generación automática de reportes en PDF**: memoria de cálculo, ficha resumen del proyecto, BOM, diagrama unifilar y checklist de cumplimiento normativo, exportables para el trámite regulatorio y para entrega al cliente.
- **Cumplimiento RETIE / NTC 2050 / normas CREG**: checklist normativo visible en el propio reporte, con estado por ítem (cumple / no aplica / pendiente de verificación), no como advertencia genérica de texto (como hoy en el panel "Siguiente fase").

**Prioridad: media-alta.** Es lo que convierte el motor de cálculo (Fase 2) en un entregable profesional utilizable frente a clientes y operadores de red.

---

## Fase 4: Simulación y frontend profesional completo

Objetivo: elevar la experiencia de usuario de "una calculadora" a "un panel de diseño de ingeniería", siguiendo las 6 pantallas ya especificadas en la Guía Práctica §12 (datos del proyecto, consumo, techo/terreno, selector de equipos, resultado técnico, instalación guiada).

- **Simulación del sistema**: producción horaria/mensual, autoconsumo, excedentes, importación desde red y clipping, sustituyendo el modelo HSP×PR fijo por series reales. Conectar `src/services/simulation/weatherProvider.ts` a un proveedor real (NASA POWER/PVGIS/Open-Meteo).
- ~~**Simulación 3D / layout de cubierta**~~ — una primera versión ya existe (`ArraySceneViewer.tsx`, Fase 0.7): paneles a escala, inclinación/orientación configurables, marcadores de equipos, cámara orbital. Pendiente: importar/dibujar el contorno real del techo (hoy es un rectángulo), obstáculos y sombras proyectadas por el sol real (hoy es esquemático, no simula sombras).
- **Comparador de equipos**: el catálogo (`src/services/catalog`) ya existe con datos mock; falta reemplazar por fichas normalizadas reales y agregar comparación lado a lado.
- **Geocodificación real** de la ubicación del proyecto conectando `src/services/maps/mapProvider.ts` (hoy `MapPreviewPlaceholder` es solo visual).
- ~~Migrar de "una sola página con anchors" a routing real~~ — completado en Fase 0.5.

**Prioridad: media.** Tiene alto impacto de percepción de producto, pero depende de que el motor de cálculo (Fase 2) y el modelo de datos (Fase 1) ya sean sólidos; construir la superficie visual antes arriesga tener que rehacerla.

---

## Fase 5: Backend, persistencia, instalación guiada y O&M

Objetivo: pasar de "app cliente-only" a plataforma real multiusuario, cubriendo el ciclo de vida completo del proyecto (instalación, comisionamiento, mantenimiento).

- Backend (Python + FastAPI según especificación del Manual Maestro §13) exponiendo el motor de cálculo de Fase 2 como servicio, con las mismas pruebas unitarias corriendo del lado servidor.
- Base de datos PostgreSQL. El modelo de datos multitenant/proyectos/versionado descrito en versiones anteriores de este roadmap se retiró del frontend en la Fase 0.7 (ver `ARCHITECTURE.md` §7) porque el producto dejó de necesitar "proyectos guardados"; si esta fase reintroduce esa necesidad, hay que rediseñar el modelo (no reactivar código viejo — ya no existe).
- Autenticación real detrás de `AuthContext` (hoy es mock local) y autorización por rol: diseñador, instalador, supervisor, cliente, auditor — el tipo `Role` sigue existiendo en `src/interfaces/user.ts`.
- **Asistente de instalación paso a paso**: checklist interactiva por proyecto (ya existe el checklist estático en Manual Maestro §8 y Guía Práctica §11 como base de contenido), con captura de evidencia real: fotos, mediciones (Voc/Isc por string), torque, seriales de equipo y firma de acta.
- **Diagnóstico de fallas**: implementar los árboles de decisión ya documentados (Manual Maestro §10) como flujo interactivo, con biblioteca de códigos de error por fabricante.
- **Monitoreo y mantenimiento (O&M)**: tickets de mantenimiento preventivo/correctivo/predictivo, con las frecuencias ya sugeridas en Manual Maestro §9.

**Prioridad: media.** Es indispensable para un producto de campo completo, pero solo tiene sentido una vez el diseño/cálculo (Fases 1–3) es confiable — instalar y mantener sistemas mal dimensionados no aporta valor.

---

## Funcionalidades futuras (post Fase 5)

- ~~**Asistente IA con RAG** sobre manuales oficiales~~ — una primera versión ya existe (`src/services/assistant`, ver `ARCHITECTURE.md` §11): búsqueda local sobre el Manual Maestro y la Guía Práctica, sin LLM externo, siempre cita la sección de origen. Pendiente para el futuro: ampliar la base a fichas de fabricantes reales (no solo los dos manuales) y, si se conecta un LLM real, mantener la misma regla — responder solo con fuente citada y prohibir inventar valores de ficha técnica, dado el riesgo de seguridad eléctrica de una recomendación incorrecta.
- **Revisor automático de diseños** vía IA, apoyado en el motor de reglas de Fase 2.
- **Integración CAD** (exportación DXF/DWG) para planos, y contorno de techo real (no rectangular) en la vista 3D.
- **API pública** para integraciones de terceros — el cliente REST genérico que existía (`src/api/endpoints.ts`) se retiró en la Fase 0.7 por falta de uso; se rediseña cuando haya backend real.
- **Multiempresa / multitenant**: vuelve a ser "futuro" tras la Fase 0.7 (se retiró el modelo que lo preparaba, ver `ARCHITECTURE.md` §7) — solo relevante si el producto vuelve a necesitar cuentas de equipo, no para la herramienta de simulación actual.
- **Internacionalización a otros países LatAm** con sus propias normativas (hoy el foco es exclusivamente Colombia, correctamente acotado en ambos manuales).

---

## Prioridades — resumen ejecutivo

| Prioridad | Fase | Razón |
|---|---|---|
| 1 | Fase 0 (saneamiento) | Barato ahora, base de todo lo demás |
| 2 | Fase 1 (modelo de datos + normativa) | Sin esto, cada funcionalidad nueva se construye desechable |
| 3 | Fase 2 (motor de cálculo) | Es el diferenciador técnico real del producto |
| 4 | Fase 3 (financiero + reportes) | Convierte el cálculo en entregable profesional/comercial |
| 5 | Fase 4 (frontend/simulación completa) | Alto impacto visual, pero depende de 1–2 |
| 6 | Fase 5 (backend/instalación/O&M) | Ciclo de vida completo, depende de que el diseño ya sea confiable |
| 7 | Futuras (IA/RAG, CAD, multi-tenant, LatAm) | Expansión una vez el core esté validado en campo |

**Recomendación de secuencia inmediata**: Fase 0 → Fase 1 → Fase 2, antes de invertir más tiempo en la superficie visual. El código actual ya resuelve razonablemente bien "una pantalla bonita"; lo que falta y es más valioso es el motor de ingeniería detrás.
