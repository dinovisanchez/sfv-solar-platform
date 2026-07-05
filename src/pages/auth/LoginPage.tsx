import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? ROUTES.app.overview;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
    navigate(redirectTo, { replace: true });
  }

  async function handleDemo() {
    setIsSubmitting(true);
    await loginAsDemo();
    setIsSubmitting(false);
    navigate(redirectTo, { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Inicia sesión</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Todavía no hay backend conectado: cualquier correo y contraseña crea una sesión de demostración.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@empresa.com"
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
        <div className="flex items-center justify-end text-sm">
          <Link to={ROUTES.forgotPassword} className="font-medium text-brand-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        o
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <Button variant="outline" className="mt-4 w-full" onClick={handleDemo} disabled={isSubmitting}>
        Continuar con cuenta demo
      </Button>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿No tienes cuenta?{" "}
        <Link to={ROUTES.register} className="font-medium text-brand-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
