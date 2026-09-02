export type Sex = "MALE" | "FEMALE";

const HEALTHY_BMI_MIN = 18.5;
const HEALTHY_BMI_MAX = 24.9;

export function getHealthyWeightRangeKg(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: HEALTHY_BMI_MIN * heightM * heightM,
    max: HEALTHY_BMI_MAX * heightM * heightM,
  };
}

// Rangos generales de referencia (no un diagnóstico médico); varían con la
// edad y la composición corporal individual.
export function getHealthyBodyFatRange(sex: Sex): { min: number; max: number } {
  return sex === "MALE" ? { min: 10, max: 20 } : { min: 18, max: 28 };
}
