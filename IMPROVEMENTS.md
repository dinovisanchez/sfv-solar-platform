# Mejoras y hallazgos técnicos — SFV Solar Platform

Fecha: 2026-07-05. Este documento lista problemas concretos encontrados en el código y configuración actuales (no en la especificación de producto), con severidad y recomendación. Ningún cambio fue aplicado; esto es un informe.

---

## 1. Problemas encontrados

### 1.1 Sin ningún commit en Git
`git log` reporta "your current branch 'main' does not have any commits yet" y `git status` muestra todo el árbol como untracked. Cualquier trabajo actual no está respaldado por control de versiones. **Severidad: alta.** Recomendación: hacer un commit inicial antes de seguir iterando.

### 1.2 Dependencias de build clasificadas como `dependencies` en vez de `devDependencies`
`vite`, `@vitejs/plugin-react` y `typescript` están en `dependencies` (`package.json`), cuando son herramientas de build/dev, no runtime. No rompe nada funcionalmente pero es una mala práctica que infla el árbol de producción si algún día se hiciera `npm install --production` o se empaquetara para un entorno serverless. **Severidad: baja.** Recomendación: mover a `devDependencies`.

### 1.3 Artefactos de compilación de `vite.config` versionados/generados junto al fuente
Existen simultáneamente `vite.config.ts` (fuente real), `vite.config.js` y `vite.config.d.ts` (salida compilada de un `tsc` anterior sobre el propio config). Esto sugiere que en algún momento se ejecutó `tsc` sobre `vite.config.ts` fuera del flujo normal de Vite (que usa esbuild/`jiti` internamente y no necesita el `.js` compilado). Riesgo real: si `vite.config.js` queda desactualizado respecto a `vite.config.ts`, Node podría resolver el `.js` obsoleto según la resolución de módulos, causando comportamiento inconsistente entre máquinas. **Severidad: media.** Recomendación: eliminar `vite.config.js` y `vite.config.d.ts`, dejar solo `vite.config.ts` (Vite lo soporta nativamente), y confirmar que `.gitignore` los excluya (ya los excluye, ver 1.4).

### 1.4 `.gitignore` ignora archivos que ya podrían necesitar limpieza de working tree
`.gitignore` ya lista `vite.config.js` y `vite.config.d.ts` como ignorados, lo cual confirma que son artefactos no deseados en el repo, pero siguen presentes físicamamente en el árbol de trabajo (no se han borrado). **Severidad: baja.** Recomendación: `rm vite.config.js vite.config.d.ts` — son regenerables y ya están en `.gitignore`.

### 1.5 Archivos `.tsbuildinfo` presentes en el árbol de trabajo
`tsconfig.node.tsbuildinfo` y `tsconfig.tsbuildinfo` son cachés incrementales de TypeScript. Están correctamente listados en `.gitignore` (`*.tsbuildinfo`), pero existen en disco. No es un bug, es esperado tras ejecutar builds localmente, solo se anota para que no se agreguen por accidente con `git add -A`. **Severidad: informativa.**

### 1.6 Contenido de assets (video, avatares) apunta a un CDN de terceros ligado a una cuenta ajena
`src/App.tsx` referencia URLs hardcodeadas a `d8j0ntlcm91z4.cloudfront.net` y `images.higgs.ai` bajo un path `user_38xzZboKViGWJOttwIXH07lWA1P/...`. Esto indica que el diseño visual proviene de una plantilla/generador externo (posiblemente una herramienta de diseño con IA) y no de assets propios del proyecto. **Riesgos:**
- Esas URLs pueden dejar de estar disponibles en cualquier momento (no hay SLA ni control sobre ellas) → la landing quedaría rota (video de fondo y avatares en blanco).
- No hay atribución ni licencia clara sobre esos activos.
- Es contenido 100% decorativo/ficticio ("Equipo técnico", avatares de personas que no existen en el proyecto) que no aporta valor de producto y puede confundir a un usuario real (parece simular un equipo o actividad que no existe).

**Severidad: media-alta** para un producto que se vaya a mostrar a clientes reales. Recomendación: sustituir por assets propios auto-hospedados (o eliminar el video/avatares decorativos) antes de cualquier despliegue público.

### 1.7 Enlaces de navegación que no llevan a contenido real
El header tiene anclas a `#dimensionador`, `#instalacion`, `#normas` e `#ia`. Solo `#dimensionador` (la sección central) y los ids `#ia` / `#normas` (aplicados a bloques del aside derecho) existen como anchors reales; no hay una sección de "Instalación" en el DOM aunque el nav la referencia — el link `#instalacion` no apunta a ningún elemento, por lo que un clic no producirá ningún scroll. **Severidad: baja (UX).**

### 1.8 Botones y controles sin `onClick` / funcionalidad
Múltiples elementos interactivos son puramente decorativos y no tienen handlers: botón de notificaciones (`Bell`), toggle "Demo/Pro", botón "Ajustar métricas" (`Settings2`), botón "+ Agregar", los tres `CommandItem` (botón play), el micrófono del "Asistente solar", y los botones "Validar strings" / "Let AI revisar" / "Ver pasos" de las `TaskCard`. Esto no es un bug de código (no truena), pero es deuda de producto: la interfaz promete funcionalidades (IA, comandos, checklist) que no existen. **Severidad: media (expectativas de usuario).**

### 1.9 Falta de accesibilidad en algunos controles
- El input `type="range"` y el input `type="number"` dentro de `NumberField` comparten la etiqueta visual pero no tienen `aria-label` redundante ni `id`/`htmlFor` explícito — funcionan porque están anidados en un `<label>`, lo cual es correcto, pero el rango no anuncia su valor actual a lectores de pantalla más allá del atributo nativo.
- El `<video>` de fondo no tiene `aria-hidden="true"` ni `role="presentation"`; al ser puramente decorativo debería excluirse explícitamente del árbol de accesibilidad.
- Iconos usados como único contenido de botones (`Bell`, `Settings2`, `Mic`) sí tienen `aria-label`, correcto. Pero `CommandItem`'s botón "play" usa `aria-label={text}` (el texto completo del comando) en lugar de algo como "Ejecutar: {text}" — es funcional pero mejorable semánticamente.

**Severidad: baja.**

### 1.10 `performanceRatio` fijo sin justificación mostrada
`performanceRatio = 0.8` está hardcodeado como constante de módulo/función y se presenta en la UI como "Fijo para esta primera etapa" — aceptable para un MVP, pero el manual técnico (`MANUAL_MAESTRO...md`, sección 6.1) indica que el PR real varía 0.75–0.88 según pérdidas, clima, inversor, etc. No hay ningún comentario en el código que explique de dónde sale el 0.8 ni enlace a la sección del manual. **Severidad: baja**, pero relevante para mantenibilidad: cuando se quiera hacer configurable, no hay ninguna referencia a qué rango es válido.

### 1.11 Ausencia total de validación de entradas
Los `NumberField` tienen `min`/`max`/`step` en el HTML nativo, pero `onChange` hace `Number(event.target.value)` sin clamping ni manejo de `NaN`. Si el usuario borra el campo (input vacío) o pega texto no numérico, `Number("")` da `0` y `Number("abc")` da `NaN`, que se propagaría directamente al cálculo (`useMemo`) y produciría `NaN`/`Infinity` en pantalla (ej. división por `hsp=0` o `inverterKw=0` → `Infinity`). No hay guard contra `hsp = 0` o `inverterKw = 0`, ambos alcanzables moviendo el slider a su extremo si `min` fuese 0 (actualmente `min` de ambos es > 0, así que no es explotable con el slider, pero sí tecleando manualmente un valor menor al `min` en el `<input type="number">`, ya que el atributo `min` de HTML no impide valores fuera de rango si se escriben directamente — solo afecta las flechas del spinner y la validación de formulario, no el evento `onChange`). **Severidad: media** — no es un fallo de seguridad, pero puede mostrar `NaN%`/`Infinity kWp` al usuario sin ningún mensaje de error.

### 1.12 Sin manejo de errores de carga de video/imágenes
Si el CDN externo (ver 1.6) falla o el usuario tiene conexión lenta, no hay `onError`, `poster`, ni estado de carga/fallback para el `<video>` ni para las imágenes de avatar (`<img>` sin `onError` que sustituya por un placeholder). **Severidad: baja.**

### 1.13 Sin `React.memo` ni necesidad aparente de optimización todavía
No es un problema hoy (la app es pequeña y el árbol de render es trivial), pero se anota para el roadmap: en cuanto se añadan más tarjetas/paneles dinámicos o listas (ej. catálogo de paneles/inversores), el patrón actual de recomputar todo en un solo `useMemo` gigante dentro de un componente monolítico dejará de escalar.

## 2. Código duplicado

- Los tres componentes decorativos locales (`AvatarStack`, `CommandItem`, `NumberField`) están definidos dentro de `App.tsx` en lugar de en `src/components/`, igual que `TaskCard`. Esto es inconsistente: `TaskCard` sí se extrajo a su propio archivo, pero componentes de complejidad similar no. No hay duplicación de lógica en sí, pero sí una convención de organización inconsistente que dificultará el crecimiento del proyecto.
- El patrón de tarjeta blanca redondeada con `shadow-sm`, `rounded-[20px] sm:rounded-[28px]`, `animate-fade-up` y `style={{ animationDelay: ... }}` se repite manualmente en al menos 8 bloques distintos de `App.tsx` con clases Tailwind casi idénticas copiadas a mano. Es candidato directo a un componente `Card`/`Panel` compartido o a una utilidad de clases (`cva`/`clsx` + una función `cardClass()`).
- Los estilos `rounded-full` + `bg-white` + tamaño fijo para "botón circular flotante" (Settings2, Mic) se repiten con markup casi idéntico (`absolute -bottom-4 left-1/2 ... -translate-x-1/2 ...`). Candidato a componente `FloatingIconButton`.

## 3. Posibles optimizaciones

- **Video de fondo pesado**: un `<video autoPlay loop muted playsInline>` de un CDN externo sin `preload="metadata"` ni versión comprimida/responsive puede afectar significativamente el tiempo de carga inicial y el consumo de datos en móvil, especialmente relevante para técnicos de campo en zonas rurales de Colombia con conectividad limitada (contexto explícito del propio dominio del proyecto). Recomendación: usar una imagen estática o gradiente CSS como fallback en conexiones lentas (`prefers-reduced-motion`, `connection.saveData`), o eliminar el video decorativo en favor de un fondo liviano.
- **Fuente externa sin `font-display` explícito más allá del `&display=swap`** — ya está bien resuelto (usa `display=swap`), sin acción necesaria.
- El cálculo en `useMemo` es trivial (aritmética simple), no requiere optimización de rendimiento por ahora; la dependencia de arreglo está correctamente declarada.
- `optimizeDeps.exclude: ["lucide-react"]` en `vite.config.ts` es una práctica común y correcta para evitar problemas de pre-bundling con paquetes de iconos de gran cantidad de archivos; no requiere cambio.

## 4. Mejoras de rendimiento

- Ninguna crítica en el estado actual (bundle pequeño, sin backend, sin listas grandes). El punto de atención real de rendimiento a futuro será cuando se agregue: catálogo de equipos (paneles/inversores/baterías), simulación horaria de producción (8760 puntos/año) y renderizado 3D de cubierta (Three.js, mencionado en el Manual Maestro) — estos sí requerirán memoización cuidadosa, web workers para cálculo pesado, y posiblemente streaming/paginación de resultados.

## 5. Mejoras de seguridad

- No se identifican vulnerabilidades de seguridad explotables en el código actual (no hay inputs que lleguen a `eval`, `dangerouslySetInnerHTML`, ni llamadas de red controladas por el usuario). Es esperable dado que no existe backend ni persistencia todavía.
- **A futuro (cuando se implemente backend/API, según el Manual Maestro)**: dado que el dominio incluye datos de clientes (facturas, consumo, ubicación, datos de contacto), habrá que aplicar desde el diseño: validación de entrada en servidor (no confiar solo en el `min`/`max` de HTML, ver hallazgo 1.11), control de acceso por rol (diseñador/instalador/supervisor/cliente/auditor, como ya prevé el manual), y cifrado de datos personales conforme a la Ley 1581 de 2012 (protección de datos personales en Colombia) — no mencionada en los manuales actuales y que debería añadirse a la sección normativa.
- Las URLs de terceros hardcodeadas (hallazgo 1.6) deberían revisarse: cargar contenido remoto de un dominio no controlado por el proyecto en producción es un vector de riesgo de disponibilidad/integridad (si ese recurso cambiara de contenido, se serviría lo que sea que el tercero decida).

## 6. Mejoras de experiencia de usuario

- Reemplazar los controles/botones decorativos sin función (comandos rápidos, asistente de voz, "Validar strings", "Let AI revisar") por un estado claro de "Próximamente" o simplemente no renderizarlos hasta que exista la funcionalidad — mostrar botones inertes que parecen funcionales genera expectativas falsas y desconfianza cuando el usuario descubre que no hacen nada.
- Mostrar mensajes de validación cuando el cálculo produce resultados fuera de rango razonable (ej. `dcAcRatio` muy alto o muy bajo, `panels = 0`), no solo el cambio de color del tag ("Alerta"/"OK").
- Persistir el estado del formulario en `localStorage` como mínimo, para que un usuario no pierda su caso de dimensionamiento al recargar accidentalmente la página (paso previo, barato, a la persistencia real en backend).
- Etiquetar claramente que los resultados son "preliminares/estimados, no válidos para diseño certificado" de forma más prominente — el manual insiste mucho en esto (secciones 1, 6.1, 16) pero la UI actual no lo comunica explícitamente al usuario final, solo internamente en el `package.json`/docs.

## 7. Recomendaciones de refactorización

1. **Extraer el motor de cálculo fuera de `App.tsx`** a un módulo puro (`src/lib/dimensionamiento.ts` o similar) con funciones testeables, replicando exactamente el pseudocódigo `dimensionarSistema()` de la Guía Práctica, y agregar pruebas unitarias (no existe ningún framework de testing instalado aún — ver `ROADMAP.md` Fase 1).
2. **Extraer `NumberField`, `AvatarStack` y `CommandItem`** a `src/components/`, consistente con `TaskCard`, cada uno en su propio archivo con su propio tipo exportado.
3. **Introducir tipos de dominio compartidos** (`src/types/` o `src/models/`): hoy no existe ni un solo `interface`/`type` que represente conceptos del dominio (Proyecto, Módulo FV, Inversor, Batería, etc.) — todo son primitivos sueltos (`number` para kWh, W, kW sin distinción de unidad a nivel de tipo). Esto es esperado en un MVP de una calculadora, pero es el primer bloqueante real para escalar hacia el modelo de datos que ya está definido conceptualmente en el Manual Maestro sección 13 (`Project`, `Site`, `LoadProfile`, `PVModule`, `Inverter`, `Battery`, etc.).
4. **Configurar ESLint + Prettier** (o Biome) desde ya — no hay ninguna herramienta de calidad de código estática configurada, lo cual es fácil de arreglar ahora y mucho más costoso de introducir tarde con más código.
5. **Eliminar artefactos de build fuera de lugar** (`vite.config.js`, `vite.config.d.ts`, ver 1.3/1.4) y hacer el primer commit limpio del repositorio.
6. **Decidir explícitamente la clasificación dev vs. prod de dependencias** (ver 1.2) antes de que el `package.json` crezca y la confusión se vuelva más costosa de corregir.
