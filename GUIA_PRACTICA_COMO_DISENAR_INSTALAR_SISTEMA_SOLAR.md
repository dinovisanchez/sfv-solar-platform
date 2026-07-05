# Guia practica: como disenar, instalar y convertir en software un sistema solar fotovoltaico

Fecha: 2026-07-05  
Enfoque: Colombia, con criterios tecnicos generales de ingenieria FV.

> Esta guia explica el metodo. Para un proyecto real se deben usar datos reales del cliente, ficha tecnica vigente de cada equipo, RETIE/NTC 2050 vigentes, requisitos del operador de red y firma de profesional competente cuando aplique.

## 1. Que hacer primero

No empieces escogiendo paneles. Empieza levantando informacion.

### Datos minimos del cliente

1. Ciudad y direccion aproximada.
2. Facturas electricas de 12 meses.
3. Consumo mensual en kWh.
4. Valor pagado por kWh.
5. Tipo de red: monofasica, bifasica o trifasica.
6. Tension: 120 V, 208 V, 220 V, 440 V u otra.
7. Potencia contratada o capacidad del transformador si es industrial.
8. Si quiere exportar excedentes o solo autoconsumir.
9. Si necesita respaldo con baterias.
10. Cargas criticas que deben funcionar cuando se va la red.
11. Area disponible de techo o terreno.
12. Tipo de cubierta: teja, metalica, losa, suelo, carport.
13. Sombras: arboles, antenas, edificios, tanques, muros.
14. Presupuesto aproximado.
15. Marca preferida o marcas prohibidas.

Sin estos datos, cualquier recomendacion de paneles, baterias o inversor es una suposicion.

## 2. Flujo profesional de diseno

El flujo correcto es:

```text
Consumo real
-> objetivo del sistema
-> recurso solar
-> area disponible
-> potencia FV preliminar
-> seleccion de modulo
-> seleccion de inversor
-> diseno de strings
-> validacion electrica DC
-> validacion electrica AC
-> protecciones
-> cableado
-> estructura
-> simulacion energetica
-> tramite con operador de red
-> planos y memoria
-> instalacion
-> pruebas
-> comisionamiento
-> monitoreo y mantenimiento
```

## 3. Como calcular la potencia solar necesaria

### Paso 1: calcular consumo diario

Si el cliente consume 900 kWh/mes:

```text
Consumo diario = 900 kWh / 30 dias
Consumo diario = 30 kWh/dia
```

### Paso 2: definir porcentaje que quiere cubrir

Si quiere cubrir 80%:

```text
Energia solar objetivo = 30 kWh/dia * 0.80
Energia solar objetivo = 24 kWh/dia
```

### Paso 3: usar horas solares pico

Ejemplo didactico: si el sitio tiene 4.5 HSP/dia.

```text
Potencia FV preliminar = Energia objetivo / (HSP * PR)
```

Donde `PR` es performance ratio. Para estimacion inicial se puede usar 0.78 a 0.85, pero para diseno serio se simula.

```text
Potencia FV = 24 / (4.5 * 0.80)
Potencia FV = 6.67 kWp
```

Resultado: se empieza evaluando un sistema cercano a 6.7 kWp DC.

## 4. Como elegir paneles

Supongamos, solo para explicar el metodo, un modulo de 610 W.

```text
Numero de modulos = 6670 W / 610 W
Numero de modulos = 10.93
```

Se redondea a una configuracion real:

```text
11 modulos * 610 W = 6.71 kWp
```

Pero todavia no esta aprobado. Ahora toca validar:

1. Si caben fisicamente en el techo.
2. Si el peso es aceptable.
3. Si la tension del string no supera el inversor.
4. Si la corriente no supera el MPPT.
5. Si el modulo tiene certificaciones aceptables.
6. Si el conector es compatible.
7. Si la garantia y soporte local sirven.

## 5. Como elegir inversor

Para 6.71 kWp DC puedes evaluar un inversor de 5 kW, 6 kW o 7 kW, segun:

1. Potencia permitida por red.
2. Relacion DC/AC aceptada.
3. Orientacion de paneles.
4. Sombras.
5. Si se permite clipping.
6. Limites del fabricante.
7. Si sera monofasico o trifasico.

Ejemplo:

```text
Relacion DC/AC = 6.71 kWp / 6 kW
Relacion DC/AC = 1.12
```

Una relacion 1.12 suele ser razonable en muchos sistemas on-grid, pero siempre debe validarse con el manual del inversor.

## 6. Como disenar strings

Aqui se decide cuantos paneles van en serie.

Necesitas de la ficha tecnica:

- Voc del modulo.
- Coeficiente de temperatura de Voc.
- Vmp del modulo.
- Isc del modulo.
- Imp del modulo.
- Tension maxima DC del inversor.
- Rango MPPT del inversor.
- Corriente maxima por MPPT.
- Corriente maxima de cortocircuito por MPPT.
- Temperatura minima del sitio.

### Paso 1: tension maxima por frio

Cuando baja la temperatura, sube el Voc. Por eso se calcula el peor caso.

```text
Voc_corregido = Voc_STC * [1 + coeficiente_Voc * (Tmin - 25)]
```

Ejemplo didactico:

```text
Voc_STC = 52 V
coeficiente Voc = -0.25%/C = -0.0025/C
Tmin = 10 C

Voc_corregido = 52 * [1 + (-0.0025 * (10 - 25))]
Voc_corregido = 52 * [1 + 0.0375]
Voc_corregido = 53.95 V
```

Si pones 11 modulos en serie:

```text
Vstring_max = 11 * 53.95
Vstring_max = 593.45 V
```

Si el inversor permite maximo 600 V DC, queda demasiado cerca. Como ingeniero, no lo aceptaria sin revisar margen, norma, exactitud de temperatura y manual. Podria convenir:

- usar 10 modulos en un string;
- usar otro inversor de 1000 V;
- dividir en 2 strings si el inversor lo permite;
- escoger otro modulo.

### Paso 2: tension de operacion MPPT

```text
Vmp_string = numero_modulos * Vmp_modulo
```

Debe caer dentro del rango MPPT del inversor durante operacion normal.

### Paso 3: corriente

En serie la corriente no se suma. Si un string tiene modulos de 610 W con `Imp = 13 A`, el string trabaja cerca de 13 A.

Si conectas dos strings en paralelo en el mismo MPPT:

```text
Corriente MPPT = 13 A + 13 A = 26 A
```

Entonces el MPPT debe aceptar esa corriente. Muchos inversores modernos tienen limite por entrada; no basta con mirar potencia.

## 7. Como calcular baterias

Primero separa cargas normales de cargas criticas.

Ejemplo de cargas criticas:

| Carga | Potencia | Horas | Energia |
|---|---:|---:|---:|
| Nevera | 200 W | 10 h equivalentes | 2.0 kWh |
| Iluminacion | 200 W | 5 h | 1.0 kWh |
| Internet | 40 W | 10 h | 0.4 kWh |
| Computador | 120 W | 5 h | 0.6 kWh |

```text
Energia critica diaria = 4.0 kWh
```

Si quiere 1 dia de autonomia con bateria LFP, DoD usable de 90%, eficiencia de 92% y margen de degradacion de 90%:

```text
Capacidad nominal = 4.0 / (0.90 * 0.92 * 0.90)
Capacidad nominal = 5.37 kWh
```

Resultado: bateria nominal minima cercana a 5.4 kWh. Comercialmente podria ser un modulo de 5 kWh si acepta menos margen, o 10 kWh si quiere mayor autonomia.

Despues validar:

1. Potencia maxima de descarga.
2. Picos de arranque.
3. Compatibilidad BMS-inversor.
4. Temperatura.
5. Ubicacion.
6. Protecciones.
7. Certificaciones.
8. Procedimiento de emergencia.

## 8. Como dimensionar cable DC

Se revisan cuatro cosas:

1. Ampacidad.
2. Caida de tension.
3. Temperatura y agrupamiento.
4. Resistencia mecanica/UV/canalizacion.

Formula simplificada de caida DC:

```text
Caida V = 2 * longitud * corriente * resistencia_del_conductor
```

El factor 2 aparece porque la corriente va por positivo y vuelve por negativo.

Ejemplo:

```text
Longitud unidireccional = 25 m
Corriente = 13 A
Resistencia cable 6 mm2 aprox = 0.0033 ohm/m

Caida V = 2 * 25 * 13 * 0.0033
Caida V = 2.145 V
```

Si el string trabaja a 420 V:

```text
Caida % = 2.145 / 420 * 100
Caida % = 0.51%
```

Ese resultado es bueno como caida, pero todavia falta validar ampacidad y norma.

## 9. Como dimensionar protecciones

### En DC

Usualmente revisas:

- Fusibles por string si hay paralelos y la corriente inversa puede superar el maximo del modulo.
- Seccionador DC bajo carga.
- SPD DC.
- Caja combinadora si aplica.
- Cable solar certificado.
- Conectores compatibles.
- Puesta a tierra/equipotencialidad.

Regla practica:

Si hay un solo string hacia un MPPT, muchas veces no se requiere fusible de string.  
Si hay varios strings en paralelo, probablemente si se requiere, pero se calcula segun corriente inversa maxima permitida por el modulo y norma aplicable.

### En AC

Revisas:

- Corriente nominal del inversor.
- Breaker de salida.
- Capacidad del tablero.
- Punto de interconexion.
- SPD AC.
- Proteccion diferencial si aplica.
- Seccionamiento requerido por operador de red.
- Medicion bidireccional.

Formula basica:

```text
Iac monofasica = Pac / Vac
Iac trifasica = Pac / (sqrt(3) * Vac)
```

Ejemplo monofasico:

```text
Pac = 6000 W
Vac = 220 V
Iac = 6000 / 220
Iac = 27.27 A
```

El breaker no se escoge automaticamente de 30 A sin revisar corriente continua, factor normativo, temperatura, conductor, tablero, curva y manual.

## 10. Como hacer la instalacion

### Secuencia real en campo

1. Recibir materiales y comparar contra BOM.
2. Revisar que modelos coincidan con planos.
3. Revisar seriales de paneles, inversor y baterias.
4. Asegurar trabajo en alturas.
5. Marcar layout en cubierta.
6. Instalar anclajes.
7. Impermeabilizar penetraciones.
8. Instalar rieles.
9. Verificar nivelacion y torque.
10. Montar paneles.
11. Conectar equipotencialidad.
12. Armar strings.
13. Etiquetar cables.
14. Medir Voc por string antes de conectar al inversor.
15. Confirmar polaridad.
16. Instalar canalizaciones.
17. Instalar protecciones DC.
18. Instalar inversor.
19. Instalar protecciones AC.
20. Conectar tablero.
21. Instalar medidor o equipo de medicion requerido.
22. Configurar inversor.
23. Configurar monitoreo.
24. Hacer pruebas de comisionamiento.
25. Entregar acta, planos as-built y manual al cliente.

## 11. Como hacer comisionamiento

Checklist minimo:

```text
[ ] Planos coinciden con instalacion
[ ] Estructura firme
[ ] Torque verificado
[ ] Modulos sin vidrio roto
[ ] Cables sin tension mecanica
[ ] Conectores sin mezcla no certificada
[ ] Polaridad correcta
[ ] Voc de cada string registrado
[ ] Corriente por string comparada
[ ] Resistencia de aislamiento medida
[ ] Tierra/equipotencialidad verificada
[ ] SPD operativo
[ ] Breakers/seccionadores identificados
[ ] Inversor configurado con parametros correctos
[ ] Monitoreo activo
[ ] Prueba de apagado realizada
[ ] Fotos finales tomadas
[ ] Usuario capacitado
```

## 12. Como convertir esto en un frontend

La aplicacion debe guiar al usuario igual que un ingeniero.

### Pantalla 1: Datos del proyecto

Campos:

- Nombre del cliente.
- Ciudad.
- Tipo de usuario: residencial, comercial, industrial, rural.
- Tipo de red.
- Tension.
- Operador de red.
- Objetivo: ahorro, respaldo, excedentes, bombeo, microred.

### Pantalla 2: Consumo

Opciones:

- Cargar facturas.
- Escribir kWh por mes.
- Cargar curva horaria.
- Seleccionar cargas criticas.

Salida:

```text
Consumo promedio mensual
Consumo diario
Demanda estimada
Energia critica
Perfil de uso
```

### Pantalla 3: Techo o terreno

Campos:

- Area disponible.
- Tipo de cubierta.
- Inclinacion.
- Azimut.
- Obstaculos.
- Sombras.

Salida:

```text
Maximo numero de paneles
Area ocupada
Advertencias por sombra
Recomendacion de estructura
```

### Pantalla 4: Selector de equipos

El usuario selecciona:

- Marca de panel.
- Modelo de panel.
- Marca de inversor.
- Modelo de inversor.
- Bateria opcional.

El sistema valida:

```text
Vstring_max < Vdc_max
Vmp_string dentro de rango MPPT
Corriente <= limite MPPT
Potencia DC/AC dentro de manual
Bateria compatible con inversor
Certificaciones cargadas
```

### Pantalla 5: Resultado tecnico

Debe mostrar:

- Numero de paneles.
- Potencia DC.
- Potencia AC.
- Strings.
- MPPT.
- Produccion mensual estimada.
- Autoconsumo.
- Excedentes.
- Protecciones.
- Cable sugerido.
- BOM.
- Alertas normativas.

### Pantalla 6: Instalacion guiada

El tecnico ve pasos:

```text
1. Verificar EPP
2. Marcar cubierta
3. Instalar anclajes
4. Instalar rieles
5. Montar modulos
6. Medir string 1
7. Medir string 2
8. Conectar inversor
9. Configurar monitoreo
10. Subir fotos
11. Firmar acta
```

Cada paso debe pedir evidencia: foto, medicion, torque, serial o firma.

## 13. Que debes hacer ahora

Mi recomendacion concreta:

1. Usar el Manual Maestro como indice general.
2. Usar esta Guia Practica como metodo.
3. Crear una carpeta `knowledge/` para separar normas, paneles, inversores, baterias y procedimientos.
4. Elegir un primer caso real: por ejemplo sistema residencial on-grid sin baterias.
5. Construir una calculadora basica:
   - entrada: kWh/mes, ciudad, HSP, potencia de panel, potencia de inversor;
   - salida: kWp requerido, numero de paneles, energia estimada, relacion DC/AC.
6. Despues agregar validacion de strings.
7. Despues agregar baterias.
8. Despues agregar protecciones y cableado.
9. Despues agregar instalacion guiada.
10. Al final agregar IA con documentos oficiales.

## 14. Primer modulo de software que conviene construir

Empieza con algo pequeno pero serio:

```text
Modulo: Dimensionador FV preliminar

Inputs:
- consumo_mensual_kwh
- cobertura_objetivo_porcentaje
- hsp
- performance_ratio
- potencia_panel_w
- potencia_inversor_kw

Outputs:
- consumo_diario_kwh
- energia_objetivo_dia
- potencia_fv_kwp
- numero_paneles
- potencia_dc_real_kwp
- relacion_dc_ac
- energia_mensual_estimada
```

Pseudocodigo:

```ts
function dimensionarSistema(input) {
  const consumoDiario = input.consumoMensualKwh / 30;
  const energiaObjetivoDia = consumoDiario * input.coberturaObjetivo;
  const potenciaFvKwp = energiaObjetivoDia / (input.hsp * input.performanceRatio);
  const numeroPaneles = Math.ceil((potenciaFvKwp * 1000) / input.potenciaPanelW);
  const potenciaDcRealKwp = (numeroPaneles * input.potenciaPanelW) / 1000;
  const relacionDcAc = potenciaDcRealKwp / input.potenciaInversorKw;
  const energiaMensualEstimada = potenciaDcRealKwp * input.hsp * input.performanceRatio * 30;

  return {
    consumoDiario,
    energiaObjetivoDia,
    potenciaFvKwp,
    numeroPaneles,
    potenciaDcRealKwp,
    relacionDcAc,
    energiaMensualEstimada
  };
}
```

Despues ese modulo se conecta con fichas tecnicas reales y deja de ser preliminar.
