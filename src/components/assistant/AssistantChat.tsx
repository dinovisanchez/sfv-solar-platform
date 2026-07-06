import { useState, type FormEvent } from "react";
import { BookOpen, Bot, Send, Sparkles, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { searchKnowledgeBase, type AssistantMatch } from "@/services/assistant/search";
import { getExcerpt, SUGGESTED_QUESTIONS } from "@/services/assistant/formatAnswer";
import { DOC_LABELS } from "@/services/assistant/knowledgeBase";

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; matches: AssistantMatch[] };

type AssistantChatProps = {
  variant?: "full" | "compact";
};

export function AssistantChat({ variant = "full" }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const matches = searchKnowledgeBase(trimmed);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
      { id: crypto.randomUUID(), role: "assistant", matches }
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  const suggestions = variant === "compact" ? SUGGESTED_QUESTIONS.slice(0, 3) : SUGGESTED_QUESTIONS;

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-white/10">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-white">
          <Bot className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold">Asistente solar</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Responde solo con el Manual Maestro y la Guía Práctica del proyecto — no inventa normativa.
          </p>
        </div>
      </div>

      <div className={cn("flex-1 space-y-4 overflow-y-auto p-4", variant === "compact" ? "h-72" : "h-[28rem]")}>
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pregunta lo que necesites sobre diseño, componentes, normativa o instalación de sistemas
              fotovoltaicos. Algunas ideas:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end gap-2">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-900 px-4 py-2.5 text-sm text-white dark:bg-white dark:text-slate-900">
                {message.text}
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                <User className="h-3.5 w-3.5" />
              </span>
            </div>
          ) : (
            <div key={message.id} className="flex gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-white">
                <Bot className="h-3.5 w-3.5" />
              </span>
              <div className="max-w-[90%] space-y-2">
                {message.matches.length === 0 ? (
                  <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-2.5 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    No encontré una sección directamente relacionada en el Manual Maestro ni en la Guía
                    Práctica. Intenta con otras palabras, o revisa esos documentos completos en la raíz del
                    repositorio.
                  </div>
                ) : (
                  message.matches.map((match) => (
                    <div
                      key={match.section.id}
                      className="rounded-2xl rounded-tl-sm bg-slate-50 p-4 text-sm dark:bg-white/5"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <Badge tone="info">{DOC_LABELS[match.section.docId]}</Badge>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <BookOpen className="h-3 w-3" /> {match.section.heading}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                        {getExcerpt(match.section.content)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/10">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ej. ¿cómo dimensiono la batería para un día de autonomía?"
          className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5"
        />
        <button
          type="submit"
          aria-label="Preguntar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400 dark:border-white/10">
        <Sparkles className="h-3 w-3" /> No reemplaza memorias de cálculo firmadas ni normativa vigente.
      </p>
    </Card>
  );
}
