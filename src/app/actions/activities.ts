"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@/generated/prisma/enums";

export type ActivityFormState = { error?: string } | undefined;

// Única fuente de verdad: los valores del enum generado desde
// prisma/schema.prisma, para que un tipo nuevo no pueda quedar validado
// aquí sin existir todavía en la base de datos (o viceversa).
const ACTIVITY_TYPES = new Set<string>(Object.values(ActivityType));

function isActivityType(value: string): value is ActivityType {
  return ACTIVITY_TYPES.has(value);
}
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024;

function parseDuration(value: FormDataEntryValue | null): number | null {
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration < 1 || duration > 600) {
    return null;
  }
  return Math.round(duration);
}

function parseDate(value: FormDataEntryValue | null): Date | null {
  const dateValue = String(value ?? "");
  if (!dateValue) return null;
  const date = new Date(dateValue);
  const today = new Date(new Date().toISOString().slice(0, 10));
  if (Number.isNaN(date.getTime()) || date.getTime() > today.getTime()) {
    return null;
  }
  return date;
}

async function uploadEvidence(file: File, groupId: string, userId: string): Promise<string | null> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size === 0 || file.size > MAX_EVIDENCE_BYTES) {
    return null;
  }

  const extension = file.type.split("/")[1];
  const blob = await put(`activities/${groupId}/${userId}-${Date.now()}.${extension}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function submitActivityAction(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const groupId = String(formData.get("groupId") ?? "");
  const type = String(formData.get("type") ?? "");
  const durationMin = parseDuration(formData.get("durationMin"));
  const date = parseDate(formData.get("date"));
  const evidence = formData.get("evidence");

  if (!groupId) {
    return { error: "Grupo inválido." };
  }
  if (!isActivityType(type)) {
    return { error: "Selecciona un tipo de actividad válido." };
  }
  if (durationMin === null) {
    return { error: "Ingresa una duración válida (1 a 600 minutos)." };
  }
  if (!date) {
    return { error: "Ingresa una fecha válida (no puede ser futura)." };
  }
  if (!(evidence instanceof File) || evidence.size === 0) {
    return { error: "Adjunta una imagen como evidencia." };
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: session.user.id } },
  });
  if (!membership) {
    return { error: "No perteneces a este grupo." };
  }

  const evidenceUrl = await uploadEvidence(evidence, groupId, session.user.id);
  if (!evidenceUrl) {
    return { error: "La imagen debe ser JPG, PNG o WEBP y pesar menos de 5 MB." };
  }

  await prisma.activity.create({
    data: {
      type,
      durationMin,
      date,
      evidenceUrl,
      userId: session.user.id,
      groupId,
    },
  });

  revalidatePath(`/groups/${groupId}`);
  return {};
}

export async function reviewActivityAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const activityId = String(formData.get("activityId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!activityId || (decision !== "approve" && decision !== "reject")) {
    return;
  }

  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity || activity.status !== "PENDING") {
    return;
  }
  if (activity.userId === session.user.id) {
    // Nadie puede aprobar/rechazar su propia actividad.
    return;
  }

  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: activity.groupId, userId: session.user.id } },
  });
  if (!membership) {
    return;
  }

  await prisma.activity.update({
    where: { id: activityId },
    data: {
      status: decision === "approve" ? "APPROVED" : "REJECTED",
      reviewedById: session.user.id,
    },
  });

  revalidatePath(`/groups/${activity.groupId}`);
}

export async function resubmitActivityAction(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const activityId = String(formData.get("activityId") ?? "");
  const type = String(formData.get("type") ?? "");
  const durationMin = parseDuration(formData.get("durationMin"));
  const evidence = formData.get("evidence");

  if (!isActivityType(type)) {
    return { error: "Selecciona un tipo de actividad válido." };
  }
  if (durationMin === null) {
    return { error: "Ingresa una duración válida (1 a 600 minutos)." };
  }

  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!activity || activity.userId !== session.user.id || activity.status !== "REJECTED") {
    return { error: "No puedes editar esta actividad." };
  }

  let evidenceUrl = activity.evidenceUrl;
  if (evidence instanceof File && evidence.size > 0) {
    const uploaded = await uploadEvidence(evidence, activity.groupId, session.user.id);
    if (!uploaded) {
      return { error: "La imagen debe ser JPG, PNG o WEBP y pesar menos de 5 MB." };
    }
    evidenceUrl = uploaded;
  }

  await prisma.activity.update({
    where: { id: activityId },
    data: {
      type,
      durationMin,
      evidenceUrl,
      status: "PENDING",
      reviewedById: null,
    },
  });

  revalidatePath(`/groups/${activity.groupId}`);
  return {};
}
