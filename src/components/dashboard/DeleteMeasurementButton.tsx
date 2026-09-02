"use client";

import { deleteMeasurementAction } from "@/app/actions/measurements";

export function DeleteMeasurementButton({ id }: { id: string }) {
  return (
    <form
      action={deleteMeasurementAction}
      onSubmit={(event) => {
        if (!window.confirm("¿Eliminar este registro? Esta acción no se puede deshacer.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-medium text-rose-600 hover:text-rose-700">
        Eliminar
      </button>
    </form>
  );
}
