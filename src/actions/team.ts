"use server";

import { prisma } from "@/lib/prisma";
import { validateTeamCode, normalizeTeamCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function createTeam(data: {
  name: string;
  code: string;
}) {
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

