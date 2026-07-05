import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FAQS } from "@/config/site";
import { cn } from "@/utils/cn";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h2 className="font-serif-display text-3xl sm:text-4xl">Preguntas frecuentes</h2>
      </div>

      <div className="mt-10 space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card key={faq.question} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
