import { describe, expect, it } from "vitest";
import { getCurrentMonthRange } from "./period";

describe("getCurrentMonthRange", () => {
  it("returns the first instant of the 1st and the last instant of the last day, in UTC", () => {
    const { start, end } = getCurrentMonthRange(new Date(Date.UTC(2026, 8, 15, 10, 30)));

    expect(start.getUTCFullYear()).toBe(2026);
    expect(start.getUTCMonth()).toBe(8);
    expect(start.getUTCDate()).toBe(1);
    expect(start.getUTCHours()).toBe(0);
    expect(start.getUTCMinutes()).toBe(0);

    expect(end.getUTCFullYear()).toBe(2026);
    expect(end.getUTCMonth()).toBe(8);
    expect(end.getUTCDate()).toBe(30);
    expect(end.getUTCHours()).toBe(23);
    expect(end.getUTCMinutes()).toBe(59);
  });

  it("handles February in a leap year correctly", () => {
    const { end } = getCurrentMonthRange(new Date(Date.UTC(2028, 1, 10)));
    expect(end.getUTCMonth()).toBe(1);
    expect(end.getUTCDate()).toBe(29);
  });

  it("handles December by rolling into January of the same year", () => {
    const { start, end } = getCurrentMonthRange(new Date(Date.UTC(2026, 11, 5)));
    expect(start.getUTCMonth()).toBe(11);
    expect(start.getUTCDate()).toBe(1);
    expect(end.getUTCMonth()).toBe(11);
    expect(end.getUTCDate()).toBe(31);
  });

  it("includes a date-only measurement (parsed as UTC midnight) on the 1st of the month", () => {
    const { start } = getCurrentMonthRange(new Date(Date.UTC(2026, 8, 15)));
    const measurementDate = new Date("2026-09-01");
    expect(measurementDate.getTime()).toBeGreaterThanOrEqual(start.getTime());
  });
});
