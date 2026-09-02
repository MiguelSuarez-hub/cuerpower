"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type GroupFormState = { error?: string } | undefined;

const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 8;
const MAX_INVITE_CODE_ATTEMPTS = 5;

function generateInviteCode(): string {
  const bytes = randomBytes(INVITE_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[bytes[i] % INVITE_CODE_ALPHABET.length];
  }
  return code;
}

export async function createGroupAction(
  _prevState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Ingresa un nombre para el grupo." };
  }

  let group = null;
  for (let attempt = 0; attempt < MAX_INVITE_CODE_ATTEMPTS && !group; attempt++) {
    try {
      group = await prisma.group.create({
        data: {
          name,
          inviteCode: generateInviteCode(),
          ownerId: session.user.id,
          members: {
            create: { userId: session.user.id },
          },
        },
      });
    } catch (error) {
      const isUniqueConflict =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002";
      if (!isUniqueConflict || attempt === MAX_INVITE_CODE_ATTEMPTS - 1) {
        throw error;
      }
    }
  }

  if (!group) {
    return { error: "No se pudo crear el grupo. Intenta de nuevo." };
  }

  redirect(`/groups/${group.id}`);
}

export async function joinGroupAction(
  _prevState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión." };
  }

  const inviteCode = String(formData.get("inviteCode") ?? "")
    .trim()
    .toUpperCase();
  if (!inviteCode) {
    return { error: "Ingresa un código de invitación." };
  }

  const group = await prisma.group.findUnique({ where: { inviteCode } });
  if (!group) {
    return { error: "No encontramos ningún grupo con ese código." };
  }

  const existingMembership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
  });
  if (existingMembership) {
    redirect(`/groups/${group.id}`);
  }

  await prisma.groupMember.create({
    data: { groupId: group.id, userId: session.user.id },
  });

  redirect(`/groups/${group.id}`);
}

export async function leaveGroupAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return;
  }

  const groupId = String(formData.get("groupId") ?? "");
  if (!groupId) {
    return;
  }

  await prisma.groupMember.deleteMany({
    where: { groupId, userId: session.user.id },
  });

  redirect("/groups");
}
