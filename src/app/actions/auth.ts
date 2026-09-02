"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";
import { calculateAge } from "@/lib/age";

const SEX_VALUES = new Set(["MALE", "FEMALE"]);

export type AuthFormState = { error?: string } | undefined;

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const birthDateValue = String(formData.get("birthDate") ?? "");
  const sex = String(formData.get("sex") ?? "");
  const height = Number(formData.get("height"));

  if (!name || !email || !password) {
    return { error: "Completa todos los campos obligatorios." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const birthDate = birthDateValue ? new Date(birthDateValue) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate.getTime() > Date.now()) {
    return { error: "Ingresa una fecha de nacimiento válida." };
  }
  const age = calculateAge(birthDate);
  if (age < 10 || age > 100) {
    return { error: "Ingresa una fecha de nacimiento válida." };
  }
  if (!SEX_VALUES.has(sex)) {
    return { error: "Selecciona tu sexo." };
  }
  if (!Number.isFinite(height) || height < 100 || height > 250) {
    return { error: "Ingresa una altura válida en centímetros." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: {
        create: { birthDate, sex: sex as "MALE" | "FEMALE", height },
      },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Tu cuenta se creó, pero no pudimos iniciar sesión. Intenta iniciar sesión manualmente." };
    }
    throw error;
  }
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
