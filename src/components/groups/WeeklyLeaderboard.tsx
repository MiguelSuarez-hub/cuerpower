import { Card } from "@/components/ui/Card";
import type { ActivityRankEntry } from "@/lib/week";

export function WeeklyLeaderboard({ entries }: { entries: ActivityRankEntry[] }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-zinc-900">Reto semanal</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Actividades aprobadas esta semana. Empates se resuelven por minutos totales.
      </p>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Aún no hay miembros en este grupo.</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-2">
          {entries.map((entry, index) => (
            <li
              key={entry.userId}
              className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-3">
                <span
                  className={
                    index === 0 && entry.approvedCount > 0
                      ? "flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-100 text-xs font-semibold text-fuchsia-700"
                      : "w-5 text-zinc-400"
                  }
                >
                  {index + 1}
                </span>
                <span className="font-medium text-zinc-900">{entry.name}</span>
              </span>
              <span className="text-zinc-600">
                {entry.approvedCount} actividad{entry.approvedCount === 1 ? "" : "es"}
                <span className="text-zinc-400"> · {entry.approvedMinutes} min</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
