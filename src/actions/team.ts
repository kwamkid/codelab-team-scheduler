"use server";

import { prisma } from "@/lib/prisma";
import { validateTeamCode, normalizeTeamCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createTeam(data: {
  name: string;
  code: string;
  adminCode: string;
}) {
  const normalizedCode = normalizeTeamCode(data.code);

  if (!validateTeamCode(normalizedCode)) {
    return { error: "รหัสทีมต้องเป็นตัวอักษรหรือตัวเลข 4-10 ตัว" };
  }

  if (!validateTeamCode(data.adminCode)) {
    return { error: "รหัส Admin ต้องเป็นตัวอักษรหรือตัวเลข 4-10 ตัว" };
  }

  const existingTeam = await prisma.team.findUnique({
    where: { code: normalizedCode },
  });

  if (existingTeam) {
    return { error: "รหัสทีมนี้มีผู้ใช้แล้ว กรุณาใช้รหัสอื่น" };
  }

  const team = await prisma.team.create({
    data: {
      name: data.name,
      code: normalizedCode,
      adminCode: data.adminCode,
    },
  });

  return { success: true, team };
}

export async function getTeamByCode(code: string) {
  const normalizedCode = normalizeTeamCode(code);

  const team = await prisma.team.findUnique({
    where: { code: normalizedCode },
    include: {
      members: {
        orderBy: { nickname: "asc" },
      },
      events: {
        orderBy: { date: "asc" },
      },
    },
  });

  return team;
}

export async function updateTeam(
  id: string,
  data: { name: string },
  adminCode: string
) {
  const team = await prisma.team.findUnique({ where: { id } });

  if (!team || team.adminCode !== adminCode) {
    return { error: "รหัส Admin ไม่ถูกต้อง" };
  }

  const updatedTeam = await prisma.team.update({
    where: { id },
    data: { name: data.name },
  });

  revalidatePath(`/team/${team.code}`);
  return { success: true, team: updatedTeam };
}

export async function deleteTeam(id: string, adminCode: string) {
  const team = await prisma.team.findUnique({ where: { id } });

  if (!team || team.adminCode !== adminCode) {
    return { error: "รหัส Admin ไม่ถูกต้อง" };
  }

  await prisma.team.delete({ where: { id } });

  return { success: true };
}

export async function verifyAdminCode(teamId: string, adminCode: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  return team?.adminCode === adminCode;
}
