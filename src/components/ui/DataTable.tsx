import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

export type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
};

export function DataTable<T>({ columns, rows, rowKey, emptyMessage }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState title="Sin resultados" description={emptyMessage ?? "Todavía no hay datos para mostrar."} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
            {columns.map((column) => (
              <th key={column.header} className="px-3 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5"
            >
              {columns.map((column) => (
                <td key={column.header} className={column.className ?? "px-3 py-3"}>
                  {column.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
