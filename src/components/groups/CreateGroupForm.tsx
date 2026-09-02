"use client";

import { useActionState } from "react";
import { createGroupAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CreateGroupForm() {
  const [state, action, pending] = useActionState(createGroupAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Input
        id="group-name"
        name="name"
        label="Nombre del grupo"
        placeholder="Reto de septiembre"
        required
      />
      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creando..." : "Crear grupo"}
      </Button>
    </form>
  );
}
