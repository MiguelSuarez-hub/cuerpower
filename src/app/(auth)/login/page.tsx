"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Iniciar sesión</h1>
      <p className="mt-1 text-sm text-zinc-600">Ingresa a tu cuenta para ver tu progreso.</p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@correo.com"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          required
        />
        {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-teal-600 hover:text-teal-700">
          Regístrate
        </Link>
      </p>
    </Card>
  );
}
