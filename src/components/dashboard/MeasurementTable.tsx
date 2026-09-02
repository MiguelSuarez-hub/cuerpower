import { DeleteMeasurementButton } from "./DeleteMeasurementButton";

type Measurement = {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  bodyFatPct?: number;
};

export function MeasurementTable({ measurements }: { measurements: Measurement[] }) {
  if (measurements.length === 0) {
    return <p className="text-sm text-zinc-500">Aún no hay mediciones registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500">
            <th className="py-2 pr-4 font-medium">Fecha</th>
            <th className="py-2 pr-4 font-medium">Peso</th>
            <th className="py-2 pr-4 font-medium">IMC</th>
            <th className="py-2 pr-4 font-medium">Grasa corporal</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m.id} className="border-b border-zinc-100 text-zinc-700 last:border-0">
              <td className="py-3 pr-4">
                {new Date(m.date).toLocaleDateString("es", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </td>
              <td className="py-3 pr-4">{m.weight.toFixed(1)} kg</td>
              <td className="py-3 pr-4">{m.bmi.toFixed(1)}</td>
              <td className="py-3 pr-4">{m.bodyFatPct ? `${m.bodyFatPct.toFixed(1)}%` : "—"}</td>
              <td className="py-3">
                <DeleteMeasurementButton id={m.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
