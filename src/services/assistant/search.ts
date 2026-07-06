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

const DIACRITICS_PATTERN = /[̀-ͯ]/g;

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(DIACRITICS_PATTERN, "");
}

function tokenize(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

export type AssistantMatch = {
  section: KnowledgeSection;
  score: number;
};

export function searchKnowledgeBase(question: string, limit = 3): AssistantMatch[] {
  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) return [];

  const normalizedQuestion = normalize(question);

  const scored: AssistantMatch[] = KNOWLEDGE_BASE.map((section) => {
    const normalizedHeading = normalize(section.heading);
    const normalizedContent = normalize(section.content);

    let score = 0;
    for (const token of queryTokens) {
      const headingHits = normalizedHeading.split(token).length - 1;
      const contentHits = normalizedContent.split(token).length - 1;
      score += headingHits * 4 + Math.min(contentHits, 5);
    }
    if (normalizedQuestion.length > 6 && normalizedHeading.includes(normalizedQuestion)) {
      score += 10;
    }

    return { section, score };
  });

  return scored
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
