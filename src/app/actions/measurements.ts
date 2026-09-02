"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateBmi } from "@/lib/bmi";

export type MeasurementFormState = { error?: string } | undefined;

export async function addMeasurementAction(
  _prevState: MeasurementFormState,
  formData: FormData,
): Promise<MeasurementFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const dateValue = String(formData.get("date") ?? "");
  const weight = Number(formData.get("weight"));
  const bodyFatRaw = formData.get("bodyFatPct");
  const bodyFatPct = bodyFatRaw ? Number(bodyFatRaw) : undefined;

  if (!dateValue || !Number.isFinite(weight) || weight <= 0) {
    return { error: "Ingresa una fecha y un peso válidos." };
  }
  if (bodyFatPct !== undefined && !Number.isFinite(bodyFatPct)) {
    return { error: "El porcentaje de grasa corporal no es válido." };
  }

  const date = new Date(dateValue);
  const today = new Date(new Date().toISOString().slice(0, 10));
  if (date.getTime() > today.getTime()) {
    return { error: "No puedes registrar una fecha futura." };
  }

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) {
    return { error: "Completa tu perfil (altura) antes de registrar mediciones." };
  }

  await prisma.measurement.create({
    data: {
      userId: session.user.id,
      date,
      weight,
      bodyFatPct: bodyFatPct ?? null,
      bmi: calculateBmi(weight, profile.height),
    },
  });

  revalidatePath("/dashboard");
}
