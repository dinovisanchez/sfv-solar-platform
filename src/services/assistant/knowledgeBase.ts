import manualMaestroRaw from "../../../MANUAL_MAESTRO_INGENIERIA_SOLAR_COLOMBIA.md?raw";
import guiaPracticaRaw from "../../../GUIA_PRACTICA_COMO_DISENAR_INSTALAR_SISTEMA_SOLAR.md?raw";

export type KnowledgeSection = {
  id: string;
  docId: "manual-maestro" | "guia-practica";
  docTitle: string;
  heading: string;
  content: string;
};

const SOURCE_DOCS = [
  { docId: "manual-maestro" as const, raw: manualMaestroRaw },
  { docId: "guia-practica" as const, raw: guiaPracticaRaw }
];

function parseDocument(docId: KnowledgeSection["docId"], raw: string): KnowledgeSection[] {
  const lines = raw.split("\n");
  const docTitle = lines.find((line) => line.startsWith("# "))?.replace(/^#\s+/, "").trim() ?? docId;

  const sections: KnowledgeSection[] = [];
  let currentHeading = docTitle;
  let currentContent: string[] = [];
  let sectionIndex = 0;

  function flush() {
    const content = currentContent.join("\n").trim();
    if (content.length > 0) {
      sections.push({
        id: `${docId}-${sectionIndex}`,
        docId,
        docTitle,
        heading: currentHeading,
        content
      });
      sectionIndex += 1;
    }
    currentContent = [];
  }

  for (const line of lines) {
    if (/^#{2,3}\s+/.test(line)) {
      flush();
      currentHeading = line.replace(/^#{2,3}\s+/, "").trim();
    } else if (!line.startsWith("# ")) {
      currentContent.push(line);
    }
  }
  flush();

  return mergeStepSections(sections);
}

const STEP_HEADING_PATTERN = /^paso\s*\d/i;

/**
 * Los pasos numerados ("Paso 1: ...", "Paso 2: ...") son subtitulos ###
 * dentro de un mismo procedimiento (ej. "6. Como disenar strings"), no
 * temas independientes. Separarlos deja la formula y el ejemplo numerico
 * en una seccion aislada que casi nunca gana la busqueda; se fusionan de
 * vuelta en la seccion padre para que la respuesta incluya el
 * procedimiento completo, no solo la lista de prerrequisitos.
 */
function mergeStepSections(sections: KnowledgeSection[]): KnowledgeSection[] {
  const merged: KnowledgeSection[] = [];
  for (const section of sections) {
    const parent = merged[merged.length - 1];
    if (STEP_HEADING_PATTERN.test(section.heading) && parent) {
      parent.content = `${parent.content}\n\n${section.heading}\n${section.content}`.trim();
    } else {
      merged.push({ ...section });
    }
  }
  return merged;
}

/**
 * Base de conocimiento estatica construida en build-time a partir de los
 * manuales de dominio del propio repo. No hay llamadas externas ni backend:
 * el asistente solo puede responder con lo que estos documentos dicen.
 */
export const KNOWLEDGE_BASE: KnowledgeSection[] = SOURCE_DOCS.flatMap(({ docId, raw }) =>
  parseDocument(docId, raw)
);

export const DOC_LABELS: Record<KnowledgeSection["docId"], string> = {
  "manual-maestro": "Manual Maestro de Ingeniería Solar",
  "guia-practica": "Guía Práctica de Diseño e Instalación"
};
