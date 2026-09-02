export type PeriodMeasurement = {
  date: Date;
  weight: number;
  bmi: number;
  bodyFatPct: number | null;
};

export type MemberMeasurements = {
  userId: string;
  name: string;
  measurements: PeriodMeasurement[];
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  delta: number | null;
};

export type LeaderboardMetric = "weight" | "bmi" | "bodyFatPct";

function metricValue(measurement: PeriodMeasurement, metric: LeaderboardMetric): number | null {
  return measurement[metric];
}

export function rankByMetric(
  members: MemberMeasurements[],
  metric: LeaderboardMetric,
): LeaderboardEntry[] {
  const entries = members.map((member) => {
    const sorted = [...member.measurements].sort((a, b) => a.date.getTime() - b.date.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    let delta: number | null = null;
    if (first && last) {
      const firstValue = metricValue(first, metric);
      const lastValue = metricValue(last, metric);
      if (firstValue !== null && lastValue !== null) {
        delta = firstValue - lastValue;
      }
    }

    return { userId: member.userId, name: member.name, delta };
  });

  return entries.sort((a, b) => {
    if (a.delta === null && b.delta === null) return 0;
    if (a.delta === null) return 1;
    if (b.delta === null) return -1;
    return b.delta - a.delta;
  });
}
