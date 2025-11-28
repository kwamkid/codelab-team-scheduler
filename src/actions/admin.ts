"use server";

import { prisma } from "@/lib/prisma";
import { validateTeamCode, normalizeTeamCode } from "@/lib/utils";

export async function getAllTeams() {
  const teams = await prisma.team.findMany({
    include: {
      _count: {
        select: {
          members: true,
          events: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return teams;
}

export async function deleteTeam(teamId: string) {
  await prisma.team.delete({
    where: { id: teamId },
  });

  return { success: true };
}

export async function updateTeamName(teamId: string, name: string) {
  await prisma.team.update({
    where: { id: teamId },
    data: { name },
  });

  return { success: true };
}

export async function createTeam(data: { name: string; code: string }) {
  const normalizedCode = normalizeTeamCode(data.code);

  if (!validateTeamCode(normalizedCode)) {
    return { error: "รหัสทีมต้องเป็นตัวอักษรหรือตัวเลข 4-10 ตัว" };
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
    },
  });

  return { success: true, team };
}

export async function getTeamMembers(teamId: string) {
  const members = await prisma.member.findMany({
    where: { teamId },
    orderBy: { nickname: "asc" },
  });

  return members;
}
