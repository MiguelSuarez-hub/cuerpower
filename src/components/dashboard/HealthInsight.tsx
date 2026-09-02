import { Card } from "@/components/ui/Card";
import { getHealthyBodyFatRange, getHealthyWeightRangeKg, type Sex } from "@/lib/health";

type HealthInsightProps = {
  heightCm: number;
  currentWeightKg: number;
  sex: Sex | null;
  currentBodyFatPct?: number;
};

export function HealthInsight({
  heightCm,
  currentWeightKg,
  sex,
  currentBodyFatPct,
}: HealthInsightProps) {
  const weightRange = getHealthyWeightRangeKg(heightCm);
  const weightMessage =
    currentWeightKg < weightRange.min
      ? `Te faltan ${(weightRange.min - currentWeightKg).toFixed(1)} kg para tu rango saludable.`
      : currentWeightKg > weightRange.max
        ? `Te sobran ${(currentWeightKg - weightRange.max).toFixed(1)} kg para tu rango saludable.`
        : "Estás dentro de tu rango de peso saludable.";

  const bodyFatRange = sex ? getHealthyBodyFatRange(sex) : null;
  const showBodyFat = bodyFatRange !== null && currentBodyFatPct !== undefined;
  const isBodyFatInRange =
    showBodyFat && currentBodyFatPct >= bodyFatRange.min && currentBodyFatPct <= bodyFatRange.max;

  return (
    <Card>
      <h2 className="text-base font-semibold text-zinc-900">Análisis de salud</h2>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:gap-10">
        <div>
          <p className="text-sm font-medium text-zinc-500">Peso saludable para tu altura</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">
            {weightRange.min.toFixed(1)}–{weightRange.max.toFixed(1)} kg
          </p>
          <p className="mt-1 text-sm text-zinc-600">{weightMessage}</p>
        </div>

        {showBodyFat && (
          <div>
            <p className="text-sm font-medium text-zinc-500">Grasa corporal de referencia</p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">
              {bodyFatRange.min}–{bodyFatRange.max}%
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              {isBodyFatInRange
                ? "Estás dentro del rango de referencia."
                : "Fuera del rango de referencia."}
            </p>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-zinc-400">
        Estos rangos son referencias generales, no un diagnóstico médico.
      </p>
    </Card>
  );
}
