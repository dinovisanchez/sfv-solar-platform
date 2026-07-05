import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    await register(name, email, password);
    setIsSubmitting(false);
    navigate(ROUTES.app.overview, { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Empieza gratis con un proyecto activo. Sin backend todavía: esta sesión se guarda solo en tu navegador.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Nombre completo"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
        />
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
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link to={ROUTES.login} className="font-medium text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
