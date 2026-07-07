import { KNOWLEDGE_BASE, type KnowledgeSection } from "@/services/assistant/knowledgeBase";

const STOPWORDS = new Set([
  "a", "al", "algo", "algun", "alguna", "algunas", "alguno", "algunos", "ante", "antes",
  "como", "con", "contra", "cual", "cuando", "de", "del", "desde", "donde", "durante",
  "e", "el", "ella", "ellas", "ellos", "en", "entre", "era", "es", "esa", "esas", "ese",
  "eso", "esos", "esta", "estas", "este", "esto", "estos", "hay", "la", "las", "le",
  "les", "lo", "los", "mas", "mi", "mis", "mucho", "muy", "no", "nos", "o", "os", "otra",
  "otras", "otro", "otros", "para", "pero", "poco", "por", "porque", "que", "quien",
  "se", "segun", "ser", "si", "sin", "sobre", "su", "sus", "tambien", "tanto", "te",
  "tiene", "todo", "todos", "tu", "tus", "un", "una", "uno", "unos", "y", "ya"
]);

/**
 * Grupos de vocabulario equivalente en el dominio FV. Sin esto, preguntas
 * como "como se conectan los paneles entre si" nunca encuentran la sección
 * "Como disenar strings" porque no comparten ninguna palabra literal.
 */
const SYNONYM_GROUPS: string[][] = [
  ["panel", "paneles", "modulo", "modulos"],
  ["conectar", "conexion", "conector", "conectores", "conectan", "conectado", "conectados", "string", "strings", "serie"],
  ["bateria", "baterias", "acumulador", "acumuladores"],
  ["inclinacion", "angulo", "tilt"],
  ["consumo", "demanda"],
  ["techo", "cubierta", "tejado"],
  ["patio", "piso", "suelo", "terreno"],
  ["instalar", "instalacion", "montar", "montaje"],
  ["proteccion", "protecciones", "fusible", "fusibles", "breaker", "seccionador"],
  ["inversor", "inversores", "inverter"],
  ["tension", "voltaje", "voltios"]
];

const DIACRITICS_PATTERN = /[̀-ͯ]/g;

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "");
}

function tokenizeWords(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function tokenizeQuery(text: string): string[] {
  return tokenizeWords(text).filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

/** Stem crudo por prefijo: une variantes como conectar/conector/conectores. */
function stem(word: string): string {
  return word.length > 6 ? word.slice(0, 6) : word;
}

function expandSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const group of SYNONYM_GROUPS) {
      if (group.includes(token)) {
        for (const synonym of group) expanded.add(synonym);
      }
    }
  }
  return [...expanded];
}

const SECTION_INDEX = KNOWLEDGE_BASE.map((section) => ({
  section,
  headingStems: tokenizeWords(section.heading).map(stem),
  contentStems: tokenizeWords(section.content).map(stem)
}));

export type AssistantMatch = {
  section: KnowledgeSection;
  score: number;
};

export function searchKnowledgeBase(question: string, limit = 3): AssistantMatch[] {
  const rawTokens = tokenizeQuery(question);
  if (rawTokens.length === 0) return [];

  const queryStems = [...new Set(expandSynonyms(rawTokens).map(stem))];
  const normalizedQuestion = normalize(question);

  const scored: AssistantMatch[] = SECTION_INDEX.map(({ section, headingStems, contentStems }) => {
    let score = 0;
    for (const queryStem of queryStems) {
      const headingHits = headingStems.filter((s) => s === queryStem).length;
      const contentHits = contentStems.filter((s) => s === queryStem).length;
      score += headingHits * 5 + Math.min(contentHits, 4);
    }
    if (normalizedQuestion.length > 6 && normalize(section.heading).includes(normalizedQuestion)) {
      score += 10;
    }

    return { section, score };
  });

  return scored
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
