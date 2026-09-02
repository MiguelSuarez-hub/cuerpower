// Semana lunes a domingo, en UTC (mismo criterio que src/lib/period.ts,
// para no reintroducir el bug de zona horaria ya corregido ahí).
export function getWeekRange(now: Date = new Date()): { start: Date; end: Date } {
  const day = now.getUTCDay(); // 0 = domingo, 1 = lunes, ...
  const diffToMonday = day === 0 ? 6 : day - 1;

  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToMonday, 0, 0, 0, 0),
  );
  const end = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 6, 23, 59, 59, 999),
  );

  return { start, end };
}

export function getPreviousWeekRange(now: Date = new Date()): { start: Date; end: Date } {
  const { start } = getWeekRange(now);
  const previousDay = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  return getWeekRange(previousDay);
}

export type ActivityRankEntry = {
  userId: string;
  name: string;
  approvedCount: number;
  approvedMinutes: number;
};

export function rankByActivityCount(members: ActivityRankEntry[]): ActivityRankEntry[] {
  return [...members].sort((a, b) => {
    if (b.approvedCount !== a.approvedCount) {
      return b.approvedCount - a.approvedCount;
    }
    return b.approvedMinutes - a.approvedMinutes;
  });
}
