"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const SEX_LABELS: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
};

type ProfileCardProps = {
  birthDate: string | null;
  age: number | null;
  sex: string | null;
};

export function ProfileCard({ birthDate, age, sex }: ProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  // Cuando el server action guarda con éxito, revalidatePath hace que el
  // padre vuelva a pasar el birthDate ya actualizado. Detectamos ese
  // cambio durante el render (patrón recomendado por React para ajustar
  // estado a partir de props, en vez de un setState dentro de un efecto).
  const [lastSyncedBirthDate, setLastSyncedBirthDate] = useState(birthDate);
  if (birthDate !== lastSyncedBirthDate) {
    setLastSyncedBirthDate(birthDate);
    setEditing(false);
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-zinc-900">Tu perfil</h2>

      {editing ? (
        <form action={action} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
          <div className="sm:w-56">
            <Input
              id="profile-birthDate"
              name="birthDate"
              type="date"
              label="Fecha de nacimiento"
              defaultValue={birthDate ?? ""}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-sm font-medium text-zinc-500">Fecha de nacimiento</p>
              <p className="mt-1 text-sm text-zinc-900">
                {birthDate
                  ? new Date(birthDate).toLocaleDateString("es", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })
                  : "No especificada"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Edad</p>
              <p className="mt-1 text-sm text-zinc-900">{age !== null ? `${age} años` : "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Sexo</p>
              <p className="mt-1 text-sm text-zinc-900">{sex ? SEX_LABELS[sex] : "No especificado"}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" onClick={() => setEditing(true)}>
            Editar fecha de nacimiento
          </Button>
        </div>
      )}
      {state?.error && <p className="mt-2 text-sm text-rose-600">{state.error}</p>}
    </Card>
  );
}
