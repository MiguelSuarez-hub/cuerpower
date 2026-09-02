import { describe, expect, it } from "vitest";
import { getPreviousWeekRange, getWeekRange, rankByActivityCount } from "./week";

describe("getWeekRange", () => {
  it("returns Monday 00:00:00 to Sunday 23:59:59 for a Wednesday", () => {
    // 2026-09-02 is a Wednesday
    const { start, end } = getWeekRange(new Date(Date.UTC(2026, 8, 2, 15, 30)));

    expect(start.getUTCDay()).toBe(1); // lunes
    expect(start.getUTCFullYear()).toBe(2026);
    expect(start.getUTCMonth()).toBe(7); // agosto (0-indexed)
    expect(start.getUTCDate()).toBe(31);
    expect(start.getUTCHours()).toBe(0);

    expect(end.getUTCDay()).toBe(0); // domingo
    expect(end.getUTCDate()).toBe(6);
    expect(end.getUTCMonth()).toBe(8); // septiembre
    expect(end.getUTCHours()).toBe(23);
  });

  it("treats Sunday as the last day of its own week, not the start of the next", () => {
    // 2026-09-06 is a Sunday
    const { start, end } = getWeekRange(new Date(Date.UTC(2026, 8, 6, 10, 0)));
    expect(start.getUTCDate()).toBe(31);
    expect(start.getUTCMonth()).toBe(7);
    expect(end.getUTCDate()).toBe(6);
    expect(end.getUTCMonth()).toBe(8);
  });

  it("handles Monday itself as the start of its own week", () => {
    // 2026-08-31 is a Monday
    const { start } = getWeekRange(new Date(Date.UTC(2026, 7, 31, 0, 0)));
    expect(start.getUTCDate()).toBe(31);
    expect(start.getUTCMonth()).toBe(7);
  });
});

describe("getPreviousWeekRange", () => {
  it("returns the Monday-Sunday range immediately before the current week", () => {
    const { start, end } = getPreviousWeekRange(new Date(Date.UTC(2026, 8, 2)));
    expect(start.getUTCDate()).toBe(24);
    expect(start.getUTCMonth()).toBe(7);
    expect(end.getUTCDate()).toBe(30);
    expect(end.getUTCMonth()).toBe(7);
  });
});

describe("rankByActivityCount", () => {
  it("ranks by approvedCount descending", () => {
    const ranked = rankByActivityCount([
      { userId: "a", name: "Ana", approvedCount: 2, approvedMinutes: 60 },
      { userId: "b", name: "Beto", approvedCount: 4, approvedMinutes: 40 },
    ]);
    expect(ranked[0].userId).toBe("b");
    expect(ranked[1].userId).toBe("a");
  });

  it("breaks a tie in approvedCount using approvedMinutes", () => {
    const ranked = rankByActivityCount([
      { userId: "a", name: "Ana", approvedCount: 3, approvedMinutes: 50 },
      { userId: "b", name: "Beto", approvedCount: 3, approvedMinutes: 90 },
    ]);
    expect(ranked[0].userId).toBe("b");
    expect(ranked[1].userId).toBe("a");
  });
});
