import { Link, Navigate, useParams } from "react-router-dom";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { CATALOG_CATEGORIES } from "@/services/catalog/categories";
import { CATALOG_DATA } from "@/services/catalog/mockData";
import type { CatalogCategory, CatalogItem } from "@/models/catalog";
import { ROUTES } from "@/constants/routes";

export function CatalogListPage() {
  const { category } = useParams<{ category: CatalogCategory }>();

  if (!category) {
    return <Navigate to={ROUTES.app.catalog(CATALOG_CATEGORIES[0].slug)} replace />;
  }

  const config = CATALOG_CATEGORIES.find((entry) => entry.slug === category);
  const items = CATALOG_DATA[category] ?? [];

  if (!config) {
    return <Navigate to={ROUTES.app.catalog(CATALOG_CATEGORIES[0].slug)} replace />;
  }

  const columns: Column<CatalogItem>[] = [
    { header: "Fabricante", accessor: (item) => item.manufacturer },
    { header: "Modelo", accessor: (item) => item.model },
    { header: "Especificaciones", accessor: (item) => config.formatSpecs(item) },
    {
      header: "Certificaciones",
      accessor: (item) => (
        <div className="flex flex-wrap gap-1.5">
          {item.certifications.map((certification) => (
            <Badge key={certification} tone="neutral">
              {certification}
            </Badge>
          ))}
        </div>
      )
    }
  ];

  return (
    <DashboardPage title="Catálogo de equipos">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATALOG_CATEGORIES.map((entry) => (
          <Link
            key={entry.slug}
            to={ROUTES.app.catalog(entry.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              entry.slug === category
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            )}
          >
            {entry.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{config.description}</p>

      <DataTable
        columns={columns}
        rows={items}
        rowKey={(item) => item.id}
        emptyMessage="Todavía no hay equipos cargados en esta categoría."
      />
    </DashboardPage>
  );
}
