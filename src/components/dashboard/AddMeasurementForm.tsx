"use client";

import { useActionState } from "react";
import { addMeasurementAction } from "@/app/actions/measurements";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AddMeasurementForm() {
  const [state, action, pending] = useActionState(addMeasurementAction, undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-4">
      <Input
        id="measurement-date"
        name="date"
        label="Fecha"
        type="date"
        defaultValue={today}
        max={today}
        required
      />
      <Input
        id="measurement-weight"
        name="weight"
        label="Peso (kg)"
        type="number"
        step="0.1"
        placeholder="70.5"
        required
      />
      <Input
        id="measurement-body-fat"
        name="bodyFatPct"
        label="Grasa corporal % (opcional)"
        type="number"
        step="0.1"
        placeholder="18.0"
      />
      <div className="flex flex-col justify-end gap-2">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Guardando..." : "Añadir registro"}
        </Button>
        {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      </div>
    </form>
  );
}
