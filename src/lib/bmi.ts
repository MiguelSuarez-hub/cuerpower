export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function bmiCategory(bmi: number): { label: string; className: string } {
  if (bmi < 18.5) return { label: "Bajo peso", className: "bg-sky-50 text-sky-700" };
  if (bmi < 25) return { label: "Peso saludable", className: "bg-emerald-50 text-emerald-700" };
  if (bmi < 30) return { label: "Sobrepeso", className: "bg-amber-50 text-amber-700" };
  return { label: "Obesidad", className: "bg-rose-50 text-rose-700" };
}
