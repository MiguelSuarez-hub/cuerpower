import { describe, expect, it } from "vitest";
import { rankByMetric, type MemberMeasurements } from "./leaderboard";

function m(date: string, weight: number, bmi: number, bodyFatPct: number | null = null) {
  return { date: new Date(date), weight, bmi, bodyFatPct };
}

describe("rankByMetric", () => {
  it("ranks members by weight lost, most lost first", () => {
    const members: MemberMeasurements[] = [
      { userId: "a", name: "Ana", measurements: [m("2026-09-01", 80, 26), m("2026-09-28", 78, 25.4)] },
      { userId: "b", name: "Beto", measurements: [m("2026-09-01", 90, 28), m("2026-09-28", 85, 26.5)] },
    ];

    const ranking = rankByMetric(members, "weight");

    expect(ranking[0].userId).toBe("b");
    expect(ranking[0].delta).toBe(5);
    expect(ranking[1].userId).toBe("a");
    expect(ranking[1].delta).toBe(2);
  });

  it("uses only the first and last measurement of the period, ignoring the ones in between", () => {
    const members: MemberMeasurements[] = [
      {
        userId: "a",
        name: "Ana",
        measurements: [m("2026-09-01", 80, 26), m("2026-09-10", 70, 23), m("2026-09-28", 78, 25.4)],
      },
    ];

    const [entry] = rankByMetric(members, "weight");
    expect(entry.delta).toBe(2);
  });

  it("returns a null delta for a member with no measurements in the period", () => {
    const members: MemberMeasurements[] = [
      { userId: "a", name: "Ana", measurements: [m("2026-09-01", 80, 26), m("2026-09-28", 78, 25.4)] },
      { userId: "b", name: "Beto", measurements: [] },
    ];

    const ranking = rankByMetric(members, "weight");
    expect(ranking[0].userId).toBe("a");
    expect(ranking[1]).toEqual({ userId: "b", name: "Beto", delta: null });
  });

  it("returns a null delta for bodyFatPct when either endpoint is missing it, and sorts null last", () => {
    const members: MemberMeasurements[] = [
      {
        userId: "a",
        name: "Ana",
        measurements: [m("2026-09-01", 80, 26, 24), m("2026-09-28", 78, 25.4, 22)],
      },
      {
        userId: "b",
        name: "Beto",
        measurements: [m("2026-09-01", 90, 28, null), m("2026-09-28", 85, 26.5, 20)],
      },
    ];

    const ranking = rankByMetric(members, "bodyFatPct");
    expect(ranking[0]).toEqual({ userId: "a", name: "Ana", delta: 2 });
    expect(ranking[1]).toEqual({ userId: "b", name: "Beto", delta: null });
  });

  it("returns a delta of 0 for a member with a single measurement in the period", () => {
    const members: MemberMeasurements[] = [
      { userId: "a", name: "Ana", measurements: [m("2026-09-15", 80, 26)] },
    ];

    const [entry] = rankByMetric(members, "weight");
    expect(entry.delta).toBe(0);
  });
});
