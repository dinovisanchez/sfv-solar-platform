export type InstallationStep = {
  title: string;
  description: string;
};

export type InstallationFlowInput = {
  surface: "techo" | "patio";
  hasBattery: boolean;
  hasTransformer: boolean;
  meteringType?: "directa" | "semidirecta" | "indirecta";
};

/**
 * Secuencia de instalacion de referencia (Manual Maestro SS7, Guia Practica
 * SS10-11). No reemplaza el procedimiento especifico del fabricante ni el
 * plan de trabajo en alturas de cada proyecto.
 */
export function buildInstallationFlow({
  surface,
  hasBattery,
  hasTransformer,
  meteringType
}: InstallationFlowInput): InstallationStep[] {
  const steps: InstallationStep[] = [
    {
      title: "Preparación",
      description: "EPP, permisos, verificación de estructura y rutas de cableado."
    },
    {
      title: surface === "techo" ? "Anclajes e impermeabilización" : "Cimentación / bases",
      description:
        surface === "techo"
          ? "Marcar layout, instalar anclajes e impermeabilizar penetraciones antes de montar rieles."
          : "Preparar bases o cimentación de la estructura a nivel de piso."
    },
    {
      title: "Montaje de estructura",
      description: surface === "techo" ? "Rieles y ganchos/clamps según tipo de cubierta." : "Estructura fija o tipo carport."
    },
    {
      title: "Montaje de paneles",
      description: "Instalar módulos respetando zonas de sujeción y ventilación; registrar seriales."
    },
    {
      title: "Cableado DC",
      description: "Armar strings, crimpar conectores, etiquetar positivos/negativos, medir Voc y polaridad."
    },
    {
      title: "Protecciones DC",
      description: "Seccionador, fusibles de string si aplica, SPD tipo 2, caja combinadora."
    },
    {
      title: "Instalación del inversor",
      description: "Montaje con ventilación y distancias del manual; conexión de strings y puesta a tierra."
    }
  ];

  if (hasBattery) {
    steps.push({
      title: "Instalación de baterías",
      description: "Ubicación ventilada, conexión BMS-inversor, protecciones dedicadas y procedimiento de emergencia."
    });
  }

  steps.push({
    title: "Protecciones y cableado AC",
    description: "Breaker de interconexión, SPD AC, conductor dimensionado por ampacidad y caída de tensión."
  });

  if (hasTransformer) {
    steps.push({
      title: "Instalación del transformador",
      description: "Montaje, conexiones primario/secundario y coordinación de protecciones con el operador de red."
    });
  }

  const meteringDescription =
    meteringType === "indirecta"
      ? "Sistema de medición indirecta: transformadores de corriente (TC) y de tensión (TP), bloque de borneras de prueba, medidor bidireccional en el lado de alta tensión del punto de conexión."
      : meteringType === "semidirecta"
        ? "Sistema de medición semidirecta: transformadores de corriente (TC) por fase, bloque de borneras de prueba, medidor bidireccional con tensión medida en forma directa."
        : "Sistema de medición directa: medidor bidireccional conectado directamente, sin transformadores de instrumento.";

  steps.push(
    {
      title: "Instalación del sistema de medición",
      description: meteringDescription
    },
    {
      title: "Conexión a red",
      description: "Verificación del punto de conexión y trámite de puesta en servicio ante el operador de red."
    },
    {
      title: "Puesta a tierra y equipotencialidad",
      description: "Verificación de continuidad y resistencia de puesta a tierra de toda la instalación."
    },
    {
      title: "Comisionamiento",
      description: "Pruebas de aislamiento, polaridad, protecciones, monitoreo y acta de puesta en marcha."
    }
  );

  return steps;
}
