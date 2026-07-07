import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card } from "@/components/ui/Card";
import { MarkdownContent } from "@/components/docs/MarkdownContent";
import { KNOWLEDGE_BASE, DOC_LABELS, type KnowledgeSection } from "@/services/assistant/knowledgeBase";
import { cn } from "@/utils/cn";

function groupByDoc(sections: KnowledgeSection[]) {
  const groups = new Map<KnowledgeSection["docId"], KnowledgeSection[]>();
  for (const section of sections) {
    const list = groups.get(section.docId) ?? [];
    list.push(section);
    groups.set(section.docId, list);
  }
  return groups;
}

export function DocsPage() {
  const [activeId, setActiveId] = useState(KNOWLEDGE_BASE[0]?.id ?? "");
  const [filter, setFilter] = useState("");

  const filteredSections = useMemo(() => {
    if (!filter.trim()) return KNOWLEDGE_BASE;
    const normalized = filter.trim().toLowerCase();
    return KNOWLEDGE_BASE.filter(
      (section) =>
        section.heading.toLowerCase().includes(normalized) || section.content.toLowerCase().includes(normalized)
    );
  }, [filter]);

  const grouped = useMemo(() => groupByDoc(filteredSections), [filteredSections]);
  const activeSection = KNOWLEDGE_BASE.find((section) => section.id === activeId) ?? KNOWLEDGE_BASE[0];

  return (
    <DashboardPage title="Documentación">
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="p-4 lg:col-span-4 xl:col-span-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Buscar en la documentación…"
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <nav className="max-h-[32rem] space-y-4 overflow-y-auto pr-1">
            {[...grouped.entries()].map(([docId, sections]) => (
              <div key={docId}>
                <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {DOC_LABELS[docId]}
                </p>
                <ul className="space-y-0.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(section.id)}
                        className={cn(
                          "w-full truncate rounded-lg px-2 py-1.5 text-left text-sm transition",
                          activeSection?.id === section.id
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                        )}
                      >
                        {section.heading}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {filteredSections.length === 0 && (
              <p className="px-2 text-sm text-slate-400">Sin resultados para "{filter}".</p>
            )}
          </nav>
        </Card>

        <Card className="p-6 lg:col-span-8 xl:col-span-9">
          {activeSection ? (
            <>
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-white/10">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {DOC_LABELS[activeSection.docId]}
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight">{activeSection.heading}</h2>
                </div>
              </div>
              <MarkdownContent content={activeSection.content} />
            </>
          ) : (
            <p className="text-sm text-slate-500">Selecciona una sección para leerla.</p>
          )}
        </Card>
      </div>
    </DashboardPage>
  );
}
