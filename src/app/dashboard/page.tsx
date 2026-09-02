import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeightChart } from "@/components/dashboard/WeightChart";
import { MeasurementTable } from "@/components/dashboard/MeasurementTable";
import { AddMeasurementForm } from "@/components/dashboard/AddMeasurementForm";
import { bmiCategory } from "@/lib/bmi";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const measurements = await prisma.measurement.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" },
  });

  const latest = measurements[measurements.length - 1];
  const category = latest ? bmiCategory(latest.bmi) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Tu progreso</h1>
        <p className="mt-1 text-sm text-zinc-600">Resumen de tus últimas mediciones.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard label="Peso actual" value={latest ? `${latest.weight.toFixed(1)} kg` : "—"} />
        <StatCard
          label="IMC"
          value={latest ? latest.bmi.toFixed(1) : "—"}
          badge={category ? { label: category.label, className: category.className } : undefined}
        />
        <StatCard
          label="Grasa corporal"
          value={latest?.bodyFatPct ? `${latest.bodyFatPct.toFixed(1)}%` : "—"}
        />
      </div>

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Evolución del peso</h2>
        <div className="mt-4">
          <WeightChart data={measurements.map((m) => ({ date: m.date.toISOString(), weight: m.weight }))} />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Añadir registro</h2>
        <div className="mt-4">
          <AddMeasurementForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-zinc-900">Historial</h2>
        <div className="mt-4">
          <MeasurementTable
            measurements={[...measurements]
              .reverse()
              .map((m) => ({
                id: m.id,
                date: m.date.toISOString(),
                weight: m.weight,
                bmi: m.bmi,
                bodyFatPct: m.bodyFatPct ?? undefined,
              }))}
          />
        </div>
      </Card>
    </div>
  );
}
