import { Card } from "@/components/ui/Card";
import type { LeaderboardEntry } from "@/lib/leaderboard";

type GroupLeaderboardProps = {
  title: string;
  unit: string;
  entries: LeaderboardEntry[];
};

export function GroupLeaderboard({ title, unit, entries }: GroupLeaderboardProps) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
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
                <span className="w-5 text-zinc-400">{index + 1}</span>
                <span className="font-medium text-zinc-900">{entry.name}</span>
              </span>
              <span
                className={
                  entry.delta !== null && entry.delta > 0
                    ? "font-medium text-emerald-600"
                    : "text-zinc-500"
                }
              >
                {entry.delta === null
                  ? "Sin datos este mes"
                  : `${entry.delta > 0 ? "-" : entry.delta < 0 ? "+" : ""}${Math.abs(entry.delta).toFixed(1)}${unit}`}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
