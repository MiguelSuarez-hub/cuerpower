import { describe, expect, it } from "vitest";
import { bmiCategory, calculateBmi } from "./bmi";

describe("calculateBmi", () => {
  it("calculates BMI from weight in kg and height in cm", () => {
    expect(calculateBmi(70, 175)).toBeCloseTo(22.857, 3);
  });

  it("increases as weight increases for a fixed height", () => {
    expect(calculateBmi(90, 175)).toBeGreaterThan(calculateBmi(70, 175));
  });

  it("decreases as height increases for a fixed weight", () => {
    expect(calculateBmi(70, 190)).toBeLessThan(calculateBmi(70, 160));
  });
});

describe("bmiCategory", () => {
  it("labels values below 18.5 as bajo peso", () => {
    expect(bmiCategory(18.4).label).toBe("Bajo peso");
  });

  it("labels values from 18.5 up to 25 as peso saludable", () => {
    expect(bmiCategory(18.5).label).toBe("Peso saludable");
    expect(bmiCategory(24.9).label).toBe("Peso saludable");
  });

  it("labels values from 25 up to 30 as sobrepeso", () => {
    expect(bmiCategory(25).label).toBe("Sobrepeso");
    expect(bmiCategory(29.9).label).toBe("Sobrepeso");
  });

  it("labels values of 30 and above as obesidad", () => {
    expect(bmiCategory(30).label).toBe("Obesidad");
    expect(bmiCategory(40).label).toBe("Obesidad");
  });
});
