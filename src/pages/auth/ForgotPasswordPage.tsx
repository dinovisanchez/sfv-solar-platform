import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    await requestPasswordReset(email);
    setIsSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </span>
        <h1 className="mt-4 text-xl font-semibold">Revisa tu correo</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Si <strong>{email}</strong> tiene una cuenta, enviaremos instrucciones para restablecer la contraseña.
        </p>
        <Link to={ROUTES.login} className="mt-6 inline-block text-sm font-medium text-brand-600 hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Ingresa tu correo y te enviaremos instrucciones para restablecerla.
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Enviar instrucciones
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to={ROUTES.login} className="font-medium text-brand-600 hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
