import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.home);
  }

  return (
    <DashboardPage title="Perfil">
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-solar-500 text-lg font-semibold text-white">
              {(user?.name ?? "U").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <Badge tone="info">{user?.role}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Nombre" name="name" defaultValue={user?.name} />
          <Input label="Correo" name="email" type="email" defaultValue={user?.email} disabled />
          <p className="text-xs text-slate-400">
            La edición de perfil y el cambio de rol requieren el backend de autenticación (ver ROADMAP.md, Fase 5).
          </p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
