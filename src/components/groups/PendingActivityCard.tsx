import { reviewActivityAction } from "@/app/actions/activities";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityLabels";

type PendingActivityCardProps = {
  id: string;
  authorName: string;
  type: string;
  durationMin: number;
  date: string;
  evidenceUrl: string;
  canReview: boolean;
};

export function PendingActivityCard({
  id,
  authorName,
  type,
  durationMin,
  date,
  evidenceUrl,
  canReview,
}: PendingActivityCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-100 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- evidencia externa en Vercel Blob */}
        <img
          src={evidenceUrl}
          alt={`Evidencia de ${ACTIVITY_TYPE_LABELS[type] ?? type}`}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div>
          <p className="text-sm font-medium text-zinc-900">
            {authorName} · {ACTIVITY_TYPE_LABELS[type] ?? type}
          </p>
          <p className="text-xs text-zinc-500">
            {durationMin} min ·{" "}
            {new Date(date).toLocaleDateString("es", {
              day: "2-digit",
              month: "short",
              timeZone: "UTC",
            })}
          </p>
        </div>
      </div>

      {canReview ? (
        <div className="flex gap-2">
          <form action={reviewActivityAction}>
            <input type="hidden" name="activityId" value={id} />
            <input type="hidden" name="decision" value="approve" />
            <button
              type="submit"
              className="rounded-full bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
            >
              Aprobar
            </button>
          </form>
          <form action={reviewActivityAction}>
            <input type="hidden" name="activityId" value={id} />
            <input type="hidden" name="decision" value="reject" />
            <button
              type="submit"
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Rechazar
            </button>
          </form>
        </div>
      ) : (
        <span className="text-xs text-zinc-400">Esperando revisión de otro miembro</span>
      )}
    </div>
  );
}
