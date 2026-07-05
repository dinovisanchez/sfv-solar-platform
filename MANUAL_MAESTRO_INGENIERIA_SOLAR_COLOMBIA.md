# Manual Maestro de Ingeniería Solar Fotovoltaica para Colombia

Versión: 0.1  
Fecha de base documental: 2026-07-05  
Rol técnico asumido: ingeniería profesional de generación solar fotovoltaica, diseño, instalación, operación, mantenimiento y arquitectura de plataforma digital.

> Este documento no reemplaza memorias de cálculo firmadas, diseños eléctricos certificados, estudios de conexión del operador de red, licencias, permisos, RETIE, NTC 2050, normas IEC/UL/IEEE/NFPA vigentes ni manuales oficiales del fabricante. Su función es servir como base maestra estructurada para ingeniería, capacitación y desarrollo de software.

## 1. Principios de diseño profesional

Un sistema solar fotovoltaico no se diseña "por número de paneles"; se diseña a partir de:

1. Perfil real de consumo.
2. Objetivo energético: autoconsumo, venta de excedentes, respaldo, reducción de demanda, bombeo, microred, electrificación rural o planta de generación.
3. Recurso solar del sitio.
4. Restricciones eléctricas del punto de conexión.
5. Restricciones mecánicas y estructurales.
6. Normativa aplicable.
7. Compatibilidad entre módulos, inversores, baterías, protecciones, canalizaciones, medición y monitoreo.
8. Seguridad de las personas, protección contra incendio, protección contra choque eléctrico, arco eléctrico, sobretensiones y falla a tierra.
9. Operación y mantenimiento durante 20 a 30 años.

Regla profesional: ningún componente se recomienda sin verificar ficha técnica vigente, manual de instalación vigente, certificaciones aplicables y compatibilidad con el resto del sistema.

## 2. Fuentes normativas y técnicas base

### Colombia

- RETIE vigente: el Ministerio de Minas y Energía publica el Reglamento Técnico de Instalaciones Eléctricas. En la página oficial consultada, el RETIE vigente aparece modificado en su última versión mediante la Resolución 40284 del 23 de junio de 2026 y organizado en cuatro libros: aspectos generales, productos objeto del RETIE, instalaciones objeto del RETIE y evaluación de la conformidad. Fuente: https://www.minenergia.gov.co/es/misional/energia-electrica-2/reglamentos-tecnicos/reglamento-t%C3%A9cnico-de-instalaciones-el%C3%A9ctricas-retie/
- NTC 2050: Código Eléctrico Colombiano. Debe usarse junto con RETIE para instalaciones eléctricas.
- Regulación de autogeneración a pequeña escala, generación distribuida, excedentes y conexión: verificar resoluciones CREG vigentes, procedimientos del operador de red y reglas de medición bidireccional antes de diseñar o conectar.
- Requisitos del operador de red: cada OR puede tener formatos, estudios, protecciones, esquemas de medida, límites de exportación y protocolos propios.

### Internacional

- IEC 61215: calificación de diseño y aprobación de tipo para módulos fotovoltaicos terrestres. La ficha IEC consultada describe ensayos para demostrar comportamiento eléctrico, térmico y resistencia a exposición prolongada. Fuente: https://webstore.iec.ch/en/publication/24312
- IEC 61730: seguridad de módulos fotovoltaicos.
- IEC 62548: requisitos de diseño de arreglos fotovoltaicos.
- IEC 62446-1: documentación, puesta en marcha, inspección y ensayos de sistemas FV conectados a red.
- IEC 62109: seguridad de convertidores/inversores usados en sistemas FV.
- IEC 62852: conectores DC para aplicaciones fotovoltaicas.
- IEC 62930 / EN 50618: cables para sistemas fotovoltaicos.
- IEC 61643: dispositivos de protección contra sobretensiones.
- IEEE 1547: interconexión de recursos energéticos distribuidos con sistemas eléctricos de potencia.
- UL 1741: inversores, convertidores y equipos de interconexión.
- UL 9540 / UL 9540A: sistemas de almacenamiento de energía y evaluación de propagación térmica.
- NFPA 70 / NEC, artículos 690, 705, 706 y relacionados: referencia útil para buenas prácticas, aunque en Colombia mandan RETIE/NTC 2050 y requisitos locales.

## 3. Conceptos físicos y eléctricos

### Radiación, irradiancia e insolación

- Irradiancia: potencia solar instantánea recibida por unidad de área, normalmente W/m2.
- Irradiación o insolación: energía solar acumulada por unidad de área, normalmente kWh/m2/día.
- HSP: horas solares pico equivalentes, usadas para estimaciones rápidas.
- GHI: irradiación global horizontal.
- DNI: irradiación directa normal.
- DHI: irradiación difusa horizontal.
- POA: irradiación en el plano del arreglo.

Para simulación seria se deben usar series meteorológicas horarias o subhorarias. Herramientas de referencia: PVWatts para estimación preliminar y SAM/PySAM para análisis técnico-económico más avanzado. PVWatts advierte que sus predicciones incluyen supuestos e incertidumbre y no distinguen completamente tecnologías ni condiciones específicas de sitio. Fuente: https://pvwatts.nrel.gov/ y https://sam.nrel.gov/

### Efecto fotovoltaico

Una celda FV convierte fotones en corriente eléctrica mediante una unión semiconductor tipo p-n. La potencia depende de irradiancia, temperatura de celda, espectro solar, ángulo de incidencia, suciedad, sombreado, degradación y pérdidas eléctricas.

Variables clave:

- Voc: tensión de circuito abierto.
- Isc: corriente de cortocircuito.
- Vmp/Imp: tensión y corriente en máxima potencia.
- Pmax: potencia nominal bajo STC.
- STC: 1000 W/m2, 25 °C de celda, espectro AM 1.5.
- NOCT/NMOT: condición más realista de operación térmica.
- Coeficiente de temperatura de Pmax, Voc e Isc.

## 4. Tipos de sistemas fotovoltaicos

### On-grid sin baterías

Conectado a red. Usa inversor grid-tie. Puede ser autoconsumo puro, autoconsumo con excedentes o generación distribuida, según regulación y contrato.

Usar cuando:

- La red es confiable.
- El objetivo principal es ahorro energético.
- No se requiere respaldo ante cortes.

No usar como solución de respaldo: por seguridad anti-isla, un inversor on-grid típico se apaga cuando falla la red.

### Off-grid

Sistema aislado con baterías, controlador/inversor y, a veces, generador auxiliar.

Usar cuando:

- No existe red.
- La red es inviable por costo o disponibilidad.
- La continuidad energética depende del sistema local.

Requiere diseño muy cuidadoso de autonomía, profundidad de descarga, temperatura, generador de respaldo y mantenimiento.

### Híbrido

Combina red, FV, baterías y respaldo. Puede operar en autoconsumo, backup, peak shaving, arbitraje, exportación limitada o microred.

Usar cuando:

- Se necesita ahorro y continuidad.
- Hay cargas críticas.
- Existe restricción de exportación o tarifa por demanda.

### Bombeo solar

Puede ser directo con variador/bomba solar o con almacenamiento en tanque. La "batería" preferible suele ser agua almacenada, no necesariamente baterías electroquímicas.

### Sistemas industriales y plantas

Exigen estudio eléctrico, protecciones, coordinación, calidad de energía, comunicaciones, SCADA, medición fiscal o comercial, estudios de red y mayor disciplina documental.

## 5. Componentes principales

### 5.1 Módulos fotovoltaicos

Tecnologías comunes:

- Monocristalino PERC: maduro, costo competitivo, buena eficiencia.
- TOPCon: alta eficiencia, buen comportamiento bifacial, tendencia fuerte en módulos modernos.
- HJT: alta eficiencia y buen coeficiente térmico, usualmente mayor costo.
- IBC/back-contact: alta eficiencia y estética, mayor costo.
- Bifacial: produce por cara frontal y posterior; requiere albedo, altura, separación y modelado correcto.
- Glass-glass: mayor robustez mecánica y potencial de degradación menor; peso mayor.
- Half-cell: menor pérdida resistiva y mejor tolerancia parcial a sombra.
- Shingled: alta densidad de celdas, estética y buen aprovechamiento de área; revisar disponibilidad y garantías.

Parámetros que se deben comparar:

- Potencia STC.
- Eficiencia de módulo.
- Dimensiones y peso.
- Voc, Isc, Vmp, Imp.
- Coeficientes de temperatura.
- Tensión máxima del sistema.
- Corriente máxima de fusible en serie.
- Carga mecánica frontal/posterior.
- Tipo de conector.
- Garantía de producto.
- Garantía de potencia y degradación anual.
- Certificaciones IEC/UL aplicables.
- Compatibilidad con inversores por corriente de entrada y tensión.

Fallas típicas:

- Hot spots.
- Microfisuras.
- PID.
- LID/LeTID.
- Delaminación.
- Amarillamiento de encapsulante.
- Cajas de conexión defectuosas.
- Diodos bypass dañados.
- Conectores incompatibles o mal crimpados.
- Vidrio roto.
- Suciedad, excrementos, hojas, cementos o sombras.

Buenas prácticas:

- No mezclar módulos de distintas características en el mismo string salvo validación de diseño.
- No conectar conectores de fabricantes diferentes si no existe certificación de compatibilidad.
- Respetar clamps, zonas de sujeción, torque y orientación permitidos por el fabricante.
- Verificar Voc corregida por temperatura mínima antes de definir número de módulos por string.
- Verificar Isc corregida, corriente máxima de entrada del MPPT y corriente admisible de protecciones/cable.

### 5.2 Inversores

Tipos:

- String on-grid.
- Central.
- Microinversores.
- Optimizadores con inversor centralizado.
- Híbridos.
- Off-grid.
- PCS para baterías.

Parámetros clave:

- Potencia AC nominal y máxima.
- Tensión nominal AC.
- Número de fases.
- Rango MPPT.
- Tensión máxima DC.
- Corriente máxima por MPPT.
- Corriente de cortocircuito admisible.
- Número de entradas por MPPT.
- Relación DC/AC permitida.
- Eficiencia europea/CEC/máxima.
- THD, factor de potencia, control Q(U), P(f), ramp rate.
- Protección anti-isla.
- AFCI si aplica.
- SPD integrado o externo requerido.
- Grado IP, temperatura, altitud, ventilación.
- Compatibilidad con baterías y medidores.
- Portal de monitoreo y protocolo de comunicación.

Marcas relevantes para evaluar por proyecto:

- Huawei, Sungrow, SMA, Fronius, GoodWe, Growatt, Solis, SolarEdge, Enphase, Deye, Sol-Ark, Victron, Schneider Electric, ABB/FIMER, Chint, Ginlong, Kaco.

Regla de selección:

No se recomienda "la mejor marca" en abstracto. Se recomienda el equipo que cumpla técnica, normativa y económicamente el caso: tensión, corriente, red, ambiente, baterías, monitoreo, garantía, soporte local, disponibilidad, certificaciones y manual vigente.

### 5.3 Baterías

Tecnologías:

- Plomo ácido inundado.
- AGM.
- Gel.
- OPzS.
- OPzV.
- Litio NMC.
- Litio LFP/LiFePO4.
- Sodio-ion, aún emergente en muchos mercados.
- Flujo, más común en aplicaciones estacionarias específicas.

Conceptos:

- BMS: sistema de gestión de batería.
- SOC: estado de carga.
- SOH: estado de salud.
- DoD: profundidad de descarga.
- C-rate: tasa de carga/descarga.
- Ciclos: vida útil asociada a DoD, temperatura y corriente.
- Round-trip efficiency: eficiencia ida y vuelta.
- Thermal runaway: riesgo de fuga térmica, crítico en litio.

Diseño de baterías:

1. Definir cargas críticas.
2. Estimar energía diaria crítica.
3. Definir autonomía.
4. Definir potencia simultánea.
5. Verificar picos de arranque.
6. Aplicar DoD usable, eficiencia y degradación.
7. Verificar rango de temperatura.
8. Verificar compatibilidad inversor-BMS.
9. Definir ventilación, separación, protección contra incendio y ubicación.
10. Documentar procedimientos de emergencia.

Fórmula preliminar:

```text
Capacidad nominal bateria (kWh) =
Energia critica diaria (kWh/dia) * dias de autonomia
/ (DoD usable * eficiencia sistema * factor degradacion)
```

### 5.4 Estructuras

Tipos:

- Cubierta metálica.
- Teja de barro/concreto.
- Losa de concreto.
- Piso.
- Carport.
- Fachada/BIPV.
- Tracker de uno o dos ejes.

Verificaciones obligatorias:

- Capacidad estructural de cubierta.
- Cargas muertas y vivas.
- Viento.
- Corrosión.
- Compatibilidad galvánica.
- Impermeabilización.
- Pendiente y drenaje.
- Caminos de mantenimiento.
- Distancias a bordes, cumbreras, equipos y zonas de bomberos si aplica.
- Torque certificado en pernos y grapas.

### 5.5 Protecciones DC y AC

DC:

- Seccionador bajo carga DC.
- Fusibles por string cuando aplique.
- Breakers DC certificados.
- SPD tipo 1/2 según riesgo y sistema de protección contra rayos.
- Caja combinadora.
- Protección contra arco si aplica.
- Puesta a tierra/equipotencialidad.

AC:

- Breaker de interconexión.
- Protección diferencial cuando aplique y sea compatible con inversor.
- SPD AC.
- Seccionamiento visible si lo exige operador de red.
- Relé de protección externo cuando aplique.
- Medición bidireccional o medidor de frontera según caso.

Nunca usar dispositivos AC en circuitos DC salvo que estén certificados explícitamente para DC con la tensión y corriente requeridas.

### 5.6 Cableado y conectores

DC:

- Cable solar certificado tipo PV1-F, IEC 62930, EN 50618 o equivalente aceptado por RETIE/NTC según caso.
- Resistencia UV, ozono, temperatura y humedad.
- Conectores MC4 o equivalentes certificados.
- Crimpado con herramienta del fabricante.
- Canalización que no acumule agua y proteja de daño mecánico.

AC:

- THHN/THWN-2, XLPE u otros conductores aceptados por norma local según instalación.
- Dimensionamiento por ampacidad, temperatura, agrupamiento, caída de tensión, cortocircuito y canalización.

Caída de tensión recomendada:

- DC: típicamente <= 1% a 2% como objetivo de diseño.
- AC: típicamente <= 1% a 3% según tramo, norma, economía y desempeño.

La caída final debe justificarse por cálculo, no por regla fija.

## 6. Dimensionamiento preliminar

### 6.1 Energía anual esperada

```text
Energia anual AC (kWh) =
Potencia DC instalada (kWp) * HSP anual equivalente * PR
```

Donde PR es performance ratio. En diseños preliminares puede estar entre 0.75 y 0.88 según pérdidas, clima, inversor, suciedad, temperatura, mismatch, cableado y disponibilidad. Para ingeniería se debe simular.

### 6.2 Número de módulos

```text
N modulos = Potencia DC objetivo (W) / Potencia modulo (W)
```

Luego ajustar por strings, MPPT, área, cargas, estructura, tensión, corriente y presupuesto.

### 6.3 Tensión máxima de string

```text
Voc_corr = Voc_STC * [1 + coef_Voc * (Tmin_celda - 25)]
Vstring_max = N_modulos_string * Voc_corr
```

Debe ser menor que la tensión máxima DC del inversor, módulos, conectores, cableado y protecciones.

### 6.4 Corriente de string y MPPT

```text
Isc_corr = Isc_STC * factor_correccion_irradiancia_temperatura_norma
```

Verificar:

- Corriente máxima de entrada por MPPT.
- Corriente máxima de cortocircuito admisible por MPPT.
- Fusible máximo de módulo.
- Ampacidad del cable.
- Capacidad de seccionadores y protecciones DC.

### 6.5 Relación DC/AC

```text
DC_AC = Potencia_DC_STC / Potencia_AC_inversor
```

Valores comunes: 1.05 a 1.35 en on-grid, según clima, orientación, clipping aceptable, contrato, inversor y economía. No exceder manual del fabricante.

## 7. Procedimiento técnico de instalación

### Antes de instalar

1. Confirmar diseño aprobado.
2. Confirmar permisos, trámite con operador de red y alcance contractual.
3. Validar fichas técnicas y manuales vigentes.
4. Inspeccionar cubierta, estructura y acceso.
5. Confirmar rutas de cableado.
6. Señalizar riesgos.
7. Bloquear/etiquetar circuitos cuando aplique.
8. Verificar EPP, línea de vida y trabajo en alturas.
9. Revisar herramientas de torque y crimpado calibradas.

### Estructura y módulos

1. Marcar layout.
2. Instalar anclajes según fabricante de estructura.
3. Impermeabilizar penetraciones.
4. Instalar rieles.
5. Verificar alineación.
6. Aplicar torque.
7. Instalar módulos respetando zonas de sujeción.
8. Mantener ventilación posterior.
9. Asegurar equipotencialidad.
10. Registrar seriales.

### Cableado DC

1. Armar strings según plano.
2. Crimpar conectores con herramienta correcta.
3. Evitar conectores suspendidos sobre cubierta.
4. Evitar curvas cerradas, bordes cortantes y contacto permanente con agua.
5. Etiquetar positivos, negativos y strings.
6. Medir polaridad.
7. Medir Voc por string.
8. Medir Isc si el procedimiento y seguridad lo permiten.
9. Comparar valores con cálculo esperado.

### Inversor y AC

1. Montar inversor con ventilación y distancias del manual.
2. Instalar protecciones DC/AC.
3. Conectar puesta a tierra.
4. Conectar strings.
5. Conectar salida AC.
6. Instalar medidor/transformadores de corriente si aplica.
7. Configurar país/red según parámetros autorizados.
8. Conectar monitoreo.
9. Verificar anti-isla, protecciones y comunicación según alcance.

### Medición y exportación

Para exportar energía en Colombia se debe validar:

- Clasificación del proyecto: autogenerador, generador distribuido, gran escala u otro.
- Capacidad permitida.
- Estudio de conexión cuando aplique.
- Medidor bidireccional o sistema de medida exigido.
- Diagrama unifilar aprobado.
- Protecciones de interfaz.
- Contrato o acuerdo de conexión.
- Reglas de liquidación de excedentes.
- Requisitos particulares del operador de red.

## 8. Comisionamiento

Pruebas mínimas recomendadas:

- Inspección visual completa.
- Continuidad de conductores de protección.
- Polaridad DC.
- Voc por string.
- Isc por string o corriente operativa comparativa.
- Resistencia de aislamiento DC.
- Verificación de puesta a tierra.
- Verificación de torque crítico.
- Verificación de SPD.
- Verificación de protecciones AC/DC.
- Curva IV en proyectos que lo ameriten.
- Termografía bajo irradiancia suficiente.
- Verificación de monitoreo.
- Prueba funcional de apagado/emergencia si aplica.
- Acta de puesta en marcha.

Documentos de entrega:

- Memoria de cálculo.
- Planos as-built.
- Diagrama unifilar.
- Fichas técnicas.
- Manuales de instalación/operación.
- Certificados de productos.
- Garantías.
- Registro de seriales.
- Resultados de pruebas.
- Fotos de instalación.
- Procedimiento de O&M.
- Acta de capacitación al usuario.

## 9. Operación y mantenimiento

### Preventivo

Frecuencia típica, ajustar por ambiente:

- Mensual: revisión remota de generación, alarmas, disponibilidad y comunicaciones.
- Trimestral/semestral: inspección visual, limpieza si producción/suciedad lo justifica, revisión de vegetación/sombras.
- Anual: torque selectivo, termografía, revisión de protecciones, puesta a tierra, cajas, conectores, cableado, estructura, corrosión y curvas de desempeño.
- Post-evento: inspección después de tormenta eléctrica, granizo, vientos fuertes, incendio cercano, inundación o intervención de terceros.

### Correctivo

Flujo general:

1. Identificar alarma o pérdida de producción.
2. Comparar con irradiancia y sistemas vecinos.
3. Revisar comunicación.
4. Revisar inversor.
5. Revisar strings.
6. Medir Voc/aislamiento/corriente.
7. Inspeccionar conectores, fusibles y protecciones.
8. Revisar termografía.
9. Sustituir componente solo con causa probable documentada.
10. Cerrar con reporte y evidencia.

### Predictivo

- Analítica de PR.
- Comparación string a string.
- Detección de clipping excesivo.
- Detección de suciedad por pérdida gradual.
- Detección de diodo bypass por patrones térmicos.
- Detección de degradación anormal.
- Detección de fallas intermitentes de aislamiento.

## 10. Biblioteca de fallas

Ejemplo de árbol de diagnóstico: string no produce.

```text
String sin producción
-> ¿Inversor reporta alarma?
   -> Sí: consultar código en manual oficial del inversor.
   -> No: revisar monitoreo por MPPT/string.
-> ¿Voc del string es cercana al valor esperado?
   -> No: posible circuito abierto, polaridad, conector, módulo roto o string incompleto.
   -> Sí: revisar corriente.
-> ¿Corriente es baja comparada con strings similares?
   -> Sí: sombra, suciedad, diodo bypass, módulo degradado, conector resistivo, fusible.
   -> No: revisar medición, MPPT, configuración o limitación.
-> ¿Hay punto caliente en termografía?
   -> Sí: aislar, inspeccionar módulo/conector/diodo y aplicar garantía si procede.
```

Ejemplo: inversor no enciende.

```text
Inversor apagado
-> ¿Hay tensión DC dentro del rango de arranque?
   -> No: revisar strings, seccionador, fusibles, polaridad.
-> ¿Hay tensión AC dentro de rango?
   -> No: revisar breaker, red, protecciones, tablero.
-> ¿Hay falla de aislamiento?
   -> Sí: localizar string/tramo con megóhmetro apropiado.
-> ¿Persiste?
   -> Consultar manual oficial y soporte del fabricante.
```

## 11. Fabricantes y proveedores: método de evaluación

### Módulos

Marcas a comparar: LONGi, Jinko, JA Solar, Trina, Canadian Solar, Astronergy, Risen, Qcells, REC, Maxeon/SunPower, Meyer Burger, First Solar para thin-film en utility cuando aplique.

Matriz mínima:

| Criterio | Peso sugerido |
|---|---:|
| Certificaciones aplicables | Obligatorio |
| Garantía de producto | Alto |
| Degradación garantizada | Alto |
| Bancabilidad/soporte | Alto |
| Disponibilidad local | Alto |
| Compatibilidad eléctrica | Obligatorio |
| Carga mecánica y corrosión | Medio/alto |
| Precio por Wp | Medio |
| Historial de fallas | Alto |

### Inversores

Marcas a comparar: Huawei, Sungrow, SMA, Fronius, GoodWe, Growatt, Solis, SolarEdge, Enphase, Deye, Sol-Ark, Victron, Schneider Electric, FIMER/ABB.

Criterios:

- Compatibilidad con red colombiana y parámetros exigidos.
- Rango MPPT y corriente compatible con módulos modernos.
- Soporte técnico local.
- Garantía y repuestos.
- Monitoreo.
- Historial de fallas.
- Compatibilidad baterías/BMS si es híbrido.
- Capacidad de exportación cero o limitación de exportación.
- Certificaciones.

### Baterías

Marcas/ecosistemas a evaluar según caso: Huawei LUNA, BYD, Pylontech, Dyness, Tesla, LG Energy Solution, Sonnen, Freedom Won, Victron-compatible batteries, Deye/Sunsynk-compatible batteries, Schneider ecosystem.

Criterios:

- Química.
- Certificación de seguridad.
- Compatibilidad BMS-inversor.
- Capacidad usable.
- Potencia continua y pico.
- Garantía por años, ciclos y energía throughput.
- Temperatura de operación.
- Escalabilidad.
- Protección contra incendio.
- Soporte local.

### Proveedores locales

No basta con que vendan equipos. Evaluar:

- Trazabilidad de importación.
- Certificados RETIE/producto cuando aplique.
- Garantía real en Colombia.
- Stock de repuestos.
- Capacitación.
- Soporte técnico.
- Manuales oficiales.
- Política de reemplazo.

## 12. Cómo instalar según fabricantes

La regla correcta es:

1. Identificar marca, modelo exacto y versión.
2. Descargar manual oficial vigente.
3. Revisar restricciones de montaje, torque, distancias, conectores, ventilación, altura, temperatura y configuración.
4. Traducir esas restricciones a reglas de software.
5. Bloquear en la plataforma cualquier diseño que viole el manual.

Ejemplos de fuentes oficiales:

- Victron publica manuales, datasheets, esquemas de sistema y herramientas como MPPT calculator en su portal de descargas. Fuente: https://www.victronenergy.com/support-and-downloads/manuals
- Huawei, SMA, Sungrow, Fronius, GoodWe, SolarEdge, Enphase y otros fabricantes tienen portales oficiales de documentación. Para una base de conocimiento confiable se debe almacenar el PDF oficial, modelo, versión, fecha y URL.

## 13. Plataforma web recomendada

No construir solo una página informativa. Construir una plataforma de ingeniería por módulos.

### Módulos funcionales

1. Diseñador solar: consumo, ciudad, techo, orientación, inclinación, sombras, tensión, tipo de red, objetivo, presupuesto y marcas permitidas.
2. Dimensionador: módulos, strings, MPPT, inversor, baterías, protecciones, cableado, canalización, puesta a tierra, producción, pérdidas y caída de tensión.
3. Simulador energético: producción horaria, autoconsumo, excedentes, importación, clipping y baterías.
4. Simulador 3D: layout de cubierta, obstáculos, sombras, pasillos y cargas.
5. Generador de planos: cubierta, distribución, unifilar, multifilar, puesta a tierra, protecciones y canalizaciones.
6. BOM: lista de materiales con cantidades, marcas, modelos, precios y alternativas.
7. Asistente de instalación paso a paso: checklist interactiva, fotos, torque, pruebas y evidencias.
8. Diagnóstico: códigos de error, árboles de falla, termografía, curvas IV y reportes.
9. Biblioteca de fabricantes: fichas normalizadas, manuales y restricciones.
10. Motor normativo: reglas RETIE/NTC/CREG/OR/IEC/UL.
11. Generador documental: memorias de cálculo, actas de comisionamiento, manual O&M y anexos.
12. Asistente IA RAG: responde solo con base en documentación cargada y cita fuente.

### Arquitectura técnica

- Frontend: Next.js + React + TypeScript.
- UI: componentes sobrios, densos y profesionales; no landing page como pantalla principal.
- Visualización: Three.js para cubierta, obstáculos, sombras y layout.
- Diagramas: canvas/SVG controlado por datos para unifilares y flujos.
- Backend: Python + FastAPI.
- Cálculo: motor propio versionado en Python, con pruebas unitarias.
- Simulación: pvlib/PySAM cuando aplique.
- Base de datos: PostgreSQL.
- Vector DB/RAG: pgvector o motor equivalente.
- Archivos: almacenamiento de PDFs, fichas, fotos y reportes.
- Jobs: Celery/RQ para simulaciones pesadas.
- Autenticación: roles por diseñador, instalador, supervisor, cliente y auditor.
- Exportación: PDF, Excel, DXF/DWG si se desarrolla integración CAD.

### Modelo de datos inicial

```text
Project
Site
LoadProfile
Tariff
PVModule
Inverter
Battery
MountingSystem
ProtectionDevice
Cable
Connector
StringDesign
ElectricalDesign
SimulationRun
Rule
ManufacturerDocument
InspectionChecklist
CommissioningTest
MaintenanceTicket
FaultCode
Report
```

### Motor de reglas

Ejemplos:

```text
Regla: Vstring_max < Vdc_max_inversor
Regla: Imp_string <= Imax_MPPT
Regla: Isc_corr <= Iscmax_MPPT
Regla: conectores_mismo_fabricante == true salvo compatibilidad certificada
Regla: bateria.compatible_con(inversor) == true
Regla: exportacion <= limite_autorizado_OR
Regla: equipo.certificacion_RETIE_producto == vigente cuando aplique
```

### Flujo de usuario didáctico

```text
Crear proyecto
-> Cargar factura o perfil horario
-> Seleccionar ciudad/sitio
-> Definir objetivo
-> Levantar cubierta o importar plano
-> Ubicar obstáculos
-> Elegir marcas permitidas
-> Calcular arreglo
-> Validar normas y fabricante
-> Simular energía
-> Dimensionar protecciones/cables
-> Generar BOM
-> Generar plano/unifilar
-> Crear checklist de instalación
-> Registrar comisionamiento
-> Activar monitoreo/O&M
```

## 14. Roadmap de desarrollo

### Fase 1: Base técnica

- Crear biblioteca de normas.
- Crear fichas de componentes.
- Crear estructura de reglas.
- Crear plantillas de cálculo.
- Crear checklists de instalación y comisionamiento.

### Fase 2: Motor de cálculo

- Cálculo de strings.
- Cálculo de cableado.
- Cálculo de protecciones.
- Estimación de producción.
- Dimensionamiento de baterías.
- Validaciones de compatibilidad.

### Fase 3: Frontend profesional

- Panel de proyecto.
- Formularios técnicos.
- Comparador de equipos.
- Resultados de simulación.
- Diagramas unifilares interactivos.
- BOM editable.

### Fase 4: Instalación y O&M

- App/checklist para técnicos.
- Evidencias fotográficas.
- Pruebas eléctricas.
- Acta de comisionamiento.
- Diagnóstico de fallas.

### Fase 5: IA especializada

- RAG sobre manuales oficiales, normas y fichas.
- Respuestas con citas.
- Prohibición de responder si no hay fuente.
- Generación de procedimientos según modelo exacto.
- Revisor automático de diseños.

## 15. Entregables profesionales futuros

1. Manual Maestro completo por módulos.
2. Biblioteca de fabricantes.
3. Base normativa Colombia/LatAm.
4. Plantillas de memoria de cálculo.
5. Plantillas de planos.
6. Checklists de instalación.
7. Checklists de mantenimiento.
8. Árboles de diagnóstico.
9. Base de códigos de error.
10. Motor de reglas.
11. MVP web.
12. Asistente IA con RAG.

## 16. Advertencias técnicas críticas

- Un sistema FV puede permanecer energizado en DC aunque el breaker AC esté apagado.
- Nunca desconectar conectores DC bajo carga si no están diseñados para interrupción.
- El arco DC es más difícil de extinguir que el AC.
- El trabajo en cubierta requiere control de caída.
- Las baterías pueden generar incendios, gases, explosión, choque eléctrico o fuga térmica.
- La exportación a red sin aprobación puede ser insegura e ilegal.
- El medidor bidireccional y las protecciones de interfaz deben cumplir lo exigido por operador de red.
- El diseño final debe estar firmado por profesional competente cuando corresponda.

## 17. Fuentes consultadas para esta versión

- Ministerio de Minas y Energía de Colombia, RETIE vigente y trazabilidad normativa: https://www.minenergia.gov.co/es/misional/energia-electrica-2/reglamentos-tecnicos/reglamento-t%C3%A9cnico-de-instalaciones-el%C3%A9ctricas-retie/
- IEC 61215-1, módulos FV terrestres, calificación de diseño y aprobación de tipo: https://webstore.iec.ch/en/publication/24312
- IEC, organización internacional de normalización electrotécnica: https://www.iec.ch/
- PVWatts Calculator, estimación de producción FV conectada a red: https://pvwatts.nrel.gov/
- System Advisor Model SAM, análisis técnico-económico de sistemas FV y baterías: https://sam.nrel.gov/
- NREL solar resource data and tools: https://www.nrel.gov/grid/solar-resource/renewable-resource-data.html
- Victron Energy, portal oficial de manuales y descargas: https://www.victronenergy.com/support-and-downloads/manuals

## 18. Siguiente paso recomendado

Convertir este documento en una carpeta de conocimiento:

```text
knowledge/
  00_fuentes/
  01_normas_colombia/
  02_normas_internacionales/
  03_paneles/
  04_inversores/
  05_baterias/
  06_estructuras/
  07_protecciones/
  08_cableado/
  09_diseno/
  10_instalacion/
  11_comisionamiento/
  12_mantenimiento/
  13_fallas/
  14_software/
```

Cada ficha técnica o manual debe tener metadatos:

```yaml
fabricante:
modelo:
tipo:
version_documento:
fecha_documento:
url_oficial:
fecha_consulta:
certificaciones:
restricciones_extraidas:
estado_revision: pendiente | validado | obsoleto
```

Así la futura IA podrá responder con trazabilidad y el motor de cálculo podrá validar diseños sin inventar.
