"use client";

import { useActionState } from "react";
import { resubmitActivityAction } from "@/app/actions/activities";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_OPTIONS } from "@/lib/activityLabels";

type ResubmitActivityFormProps = {
  id: string;
  type: string;
  durationMin: number;
  evidenceUrl: string;
};

export function ResubmitActivityForm({ id, type, durationMin, evidenceUrl }: ResubmitActivityFormProps) {
  const [state, action, pending] = useActionState(resubmitActivityAction, undefined);

  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50/40 p-3">
      <p className="text-sm font-medium text-zinc-900">
        Rechazada · {ACTIVITY_TYPE_LABELS[type] ?? type} · {durationMin} min
      </p>
      <form action={action} className="mt-3 grid gap-3 sm:grid-cols-4">
        <input type="hidden" name="activityId" value={id} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`resubmit-type-${id}`} className="text-sm font-medium text-zinc-700">
            Tipo
          </label>
          <select
            id={`resubmit-type-${id}`}
            name="type"
            defaultValue={type}
            required
            className="h-11 rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            {ACTIVITY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          id={`resubmit-duration-${id}`}
          name="durationMin"
          label="Duración (min)"
          type="number"
          min={1}
          max={600}
          defaultValue={durationMin}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`resubmit-evidence-${id}`} className="text-sm font-medium text-zinc-700">
            Nueva foto (opcional)
          </label>
          <input
            id={`resubmit-evidence-${id}`}
            name="evidence"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-teal-700"
          />
          <a
            href={evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 underline"
          >
            Ver evidencia actual
          </a>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Reenviando..." : "Reenviar"}
          </Button>
          {state?.error && <p className="text-xs text-rose-600">{state.error}</p>}
        </div>
      </form>
    </div>
  );
}
