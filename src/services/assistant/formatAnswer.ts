export function getExcerpt(content: string, maxLength = 480): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength);
  const lastBreak = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));
  const safeCut = lastBreak > maxLength * 0.5 ? cut.slice(0, lastBreak + 1) : cut;
  return `${safeCut.trim()}…`;
}

export const SUGGESTED_QUESTIONS = [
  "¿Qué es la relación DC/AC y qué valores son normales?",
  "¿Cómo se calcula la caída de tensión en el cableado DC?",
  "¿Qué diferencia hay entre un sistema on-grid, off-grid e híbrido?",
  "¿Cómo se dimensiona la capacidad de una batería?",
  "¿Qué pruebas de comisionamiento se deben hacer?",
  "¿Qué normativa aplica en Colombia para sistemas fotovoltaicos?"
];
