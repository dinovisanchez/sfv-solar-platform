import { useMemo } from "react";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

type MarkdownContentProps = {
  content: string;
  className?: string;
};

/**
 * El contenido viene siempre de los manuales del propio repo (nunca de
 * input de usuario), por lo que renderizar el HTML de marked es seguro.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const html = useMemo(() => marked.parse(content, { async: false }) as string, [content]);

  return (
    <div
      className={`prose-docs max-w-none text-sm leading-6 text-slate-700 dark:text-slate-300 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
