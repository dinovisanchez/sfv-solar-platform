import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapPreviewPlaceholder } from "@/components/engineering/MapPreviewPlaceholder";
import { formatDate } from "@/utils/formatters";
import type { Project, ProjectStatus, ProjectType } from "@/models/project";

const STATUS_OPTIONS: { label: string; value: ProjectStatus }[] = [
  { label: "Borrador", value: "borrador" },
  { label: "En diseño", value: "en_diseno" },
  { label: "En revisión", value: "en_revision" },
  { label: "Aprobado", value: "aprobado" },
  { label: "Instalado", value: "instalado" },
  { label: "Archivado", value: "archivado" }
];

const TYPE_OPTIONS: { label: string; value: ProjectType }[] = [
  { label: "Residencial", value: "residencial" },
  { label: "Comercial", value: "comercial" },
  { label: "Industrial", value: "industrial" },
  { label: "Rural", value: "rural" }
];

type GeneralTabProps = {
  project: Project;
  onSave: (patch: Partial<Project>) => Promise<void>;
};

export function GeneralTab({ project, onSave }: GeneralTabProps) {
  const [form, setForm] = useState(project);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="font-semibold">Información general</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Creado el {formatDate(project.createdAt)} · Versión {project.currentVersion}
          </p>
        </div>
        <Badge tone="info">{project.status.replace("_", " ")}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre del proyecto"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Input
          label="Empresa"
          value={form.company ?? ""}
          onChange={(event) => setForm({ ...form, company: event.target.value })}
          placeholder="Empresa instaladora o EPC"
        />
        <Input
          label="Ciudad"
          value={form.location.city}
          onChange={(event) => setForm({ ...form, location: { ...form.location, city: event.target.value } })}
        />
        <Input
          label="Departamento"
          value={form.location.department}
          onChange={(event) =>
            setForm({ ...form, location: { ...form.location, department: event.target.value } })
          }
        />
        <Input
          label="Latitud"
          type="number"
          step="any"
          value={form.location.latitude ?? ""}
          onChange={(event) =>
            setForm({
              ...form,
              location: { ...form.location, latitude: event.target.value ? Number(event.target.value) : undefined }
            })
          }
          placeholder="Ej. 4.6097"
        />
        <Input
          label="Longitud"
          type="number"
          step="any"
          value={form.location.longitude ?? ""}
          onChange={(event) =>
            setForm({
              ...form,
              location: { ...form.location, longitude: event.target.value ? Number(event.target.value) : undefined }
            })
          }
          placeholder="Ej. -74.0817"
        />
        <Select
          label="Tipo de proyecto"
          value={form.projectType}
          options={TYPE_OPTIONS}
          onChange={(event) => setForm({ ...form, projectType: event.target.value as ProjectType })}
        />
        <Select
          label="Estado"
          value={form.status}
          options={STATUS_OPTIONS}
          onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}
        />
        <div className="sm:col-span-2">
          <MapPreviewPlaceholder latitude={form.location.latitude} longitude={form.location.longitude} />
        </div>
        <div className="sm:col-span-2">
          <Button onClick={handleSubmit} disabled={isSaving}>
            Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
