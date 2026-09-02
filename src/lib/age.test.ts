import { describe, expect, it } from "vitest";
import { calculateAge } from "./age";

describe("calculateAge", () => {
  it("returns the full year difference once the birthday has passed this year", () => {
    const birthDate = new Date(Date.UTC(1996, 8, 2)); // 2 sep 1996
    const now = new Date(Date.UTC(2026, 8, 15)); // 15 sep 2026
    expect(calculateAge(birthDate, now)).toBe(30);
  });

  it("returns the same-day age on the exact birthday", () => {
    const birthDate = new Date(Date.UTC(1996, 8, 2));
    const now = new Date(Date.UTC(2026, 8, 2));
    expect(calculateAge(birthDate, now)).toBe(30);
  });

  it("subtracts one year when the birthday hasn't happened yet this year", () => {
    const birthDate = new Date(Date.UTC(1996, 8, 2)); // 2 sep
    const now = new Date(Date.UTC(2026, 7, 15)); // 15 aug, before the birthday
    expect(calculateAge(birthDate, now)).toBe(29);
  });
});
