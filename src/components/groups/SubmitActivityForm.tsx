"use client";

import { useActionState } from "react";
import { submitActivityAction } from "@/app/actions/activities";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ACTIVITY_TYPE_OPTIONS } from "@/lib/activityLabels";

export function SubmitActivityForm({ groupId }: { groupId: string }) {
  const [state, action, pending] = useActionState(submitActivityAction, undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-5">
      <input type="hidden" name="groupId" value={groupId} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="activity-type" className="text-sm font-medium text-zinc-700">
          Tipo
        </label>
        <select
          id="activity-type"
          name="type"
          required
          defaultValue=""
          className="h-11 rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="" disabled>
            Selecciona
          </option>
          {ACTIVITY_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="activity-date"
        name="date"
        label="Fecha"
        type="date"
        defaultValue={today}
        max={today}
        required
      />

      <Input
        id="activity-duration"
        name="durationMin"
        label="Duración (min)"
        type="number"
        min={1}
        max={600}
        placeholder="30"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="activity-evidence" className="text-sm font-medium text-zinc-700">
          Evidencia (foto)
        </label>
        <input
          id="activity-evidence"
          name="evidence"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-teal-700"
        />
      </div>

      <div className="flex flex-col justify-end gap-2">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Subiendo..." : "Subir actividad"}
        </Button>
        {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
      </div>
    </form>
  );
}
