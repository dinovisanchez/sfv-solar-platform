import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useRepositoryList } from "@/hooks/useRepositoryList";
import { clientRepository } from "@/services/clients/clientRepository";
import { createEmptyClient } from "@/models/client";
import type { Client } from "@/models/client";

const ORGANIZATION_ID = "org-demo";

export function ClientsPage() {
  const { items: clients, create } = useRepositoryList(clientRepository);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateClient() {
    setIsCreating(true);
    await create(createEmptyClient(ORGANIZATION_ID, `Cliente ${clients.length + 1}`));
    setIsCreating(false);
  }

  const columns: Column<Client>[] = [
    { header: "Nombre", accessor: (client) => client.name },
    { header: "Ciudad", accessor: (client) => client.city || "—" },
    { header: "Empresa", accessor: (client) => client.company || "—" },
    { header: "Correo", accessor: (client) => client.email || "—" }
  ];

  return (
    <DashboardPage
      title="Clientes"
      actions={
        <Button onClick={handleCreateClient} disabled={isCreating}>
          <Plus className="h-4 w-4" /> Nuevo cliente
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={clients}
        rowKey={(client) => client.id}
        emptyMessage="Registra tu primer cliente para asociarlo a un proyecto."
      />
    </DashboardPage>
  );
}
