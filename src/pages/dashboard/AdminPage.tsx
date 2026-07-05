import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import type { License } from "@/interfaces/subscription";
import type { User } from "@/interfaces/user";

const license: License = {
  id: "lic-demo",
  organizationId: "org-demo",
  subscriptionId: "sub-demo",
  seats: 5,
  seatsUsed: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export function AdminPage() {
  const { user } = useAuth();
  const members: User[] = user ? [user] : [];

  const columns: Column<User>[] = [
    { header: "Nombre", accessor: (member) => member.name },
    { header: "Correo", accessor: (member) => member.email },
    { header: "Rol", accessor: (member) => <Badge tone="info">{member.role}</Badge> }
  ];

  return (
    <DashboardPage title="Administrador">
      <Card>
        <CardHeader>
          <p className="font-semibold">Miembros de la organización</p>
          <Badge tone="neutral">
            {license.seatsUsed}/{license.seats} licencias usadas
          </Badge>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} rows={members} rowKey={(member) => member.id} />
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
