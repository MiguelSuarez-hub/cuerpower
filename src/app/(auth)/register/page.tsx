"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Crea tu cuenta</h1>
      <p className="mt-1 text-sm text-zinc-600">Empieza a registrar tu progreso hoy mismo.</p>

      <form action={action} className="mt-6 flex flex-col gap-4">
        <Input id="name" name="name" label="Nombre" placeholder="Tu nombre" required />
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
          minLength={8}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="age"
            name="age"
            type="number"
            label="Edad"
            placeholder="25"
            min={10}
            max={100}
            required
          />
          <Input
            id="height"
            name="height"
            type="number"
            label="Altura (cm)"
            placeholder="170"
            min={100}
            max={250}
            required
          />
        </div>
        {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
          Inicia sesión
        </Link>
      </p>
    </Card>
  );
}
