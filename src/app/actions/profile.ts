"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateAge } from "@/lib/age";

export type ProfileFormState = { error?: string } | undefined;

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const birthDateValue = String(formData.get("birthDate") ?? "");
  const birthDate = birthDateValue ? new Date(birthDateValue) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate.getTime() > Date.now()) {
    return { error: "Ingresa una fecha de nacimiento válida." };
  }
  const age = calculateAge(birthDate);
  if (age < 10 || age > 100) {
    return { error: "Ingresa una fecha de nacimiento válida." };
  }

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { birthDate },
  });

  revalidatePath("/dashboard");
  return {};
}
