import { describe, expect, it } from "vitest";
import { getHealthyBodyFatRange, getHealthyWeightRangeKg } from "./health";

describe("getHealthyWeightRangeKg", () => {
  it("computes the weight range for a BMI of 18.5–24.9 at a given height", () => {
    const { min, max } = getHealthyWeightRangeKg(178);
    expect(min).toBeCloseTo(58.6, 1);
    expect(max).toBeCloseTo(78.9, 1);
  });

  it("returns a wider range for a taller person", () => {
    const shorter = getHealthyWeightRangeKg(160);
    const taller = getHealthyWeightRangeKg(190);
    expect(taller.min).toBeGreaterThan(shorter.min);
    expect(taller.max).toBeGreaterThan(shorter.max);
  });
});

describe("getHealthyBodyFatRange", () => {
  it("returns the male reference range", () => {
    expect(getHealthyBodyFatRange("MALE")).toEqual({ min: 10, max: 20 });
  });

  it("returns the female reference range", () => {
    expect(getHealthyBodyFatRange("FEMALE")).toEqual({ min: 18, max: 28 });
  });
});
