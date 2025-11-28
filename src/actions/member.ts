"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMember(teamId: string, nickname: string, color: string = "blue") {
  if (!nickname.trim()) {
    return { error: "กรุณาใส่ชื่อเล่น" };
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return { error: "ไม่พบทีม" };
  }

  const member = await prisma.member.create({
    data: {
      teamId,
      nickname: nickname.trim(),
      color,
    },
  });

  revalidatePath(`/team/${team.code}`);
  return { success: true, member };
}

export async function updateMember(id: string, nickname: string, color?: string) {
  if (!nickname.trim()) {
    return { error: "กรุณาใส่ชื่อเล่น" };
  }

  const member = await prisma.member.findUnique({
    where: { id },
    include: { team: true },
  });

  if (!member) {
    return { error: "ไม่พบสมาชิก" };
  }

  const updatedMember = await prisma.member.update({
    where: { id },
    data: {
      nickname: nickname.trim(),
      ...(color && { color }),
    },
  });

  revalidatePath(`/team/${member.team.code}`);
  return { success: true, member: updatedMember };
}

export async function deleteMember(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { team: true },
  });

  if (!member) {
    return { error: "ไม่พบสมาชิก" };
  }

  await prisma.member.delete({ where: { id } });

  revalidatePath(`/team/${member.team.code}`);
  return { success: true };
}

export async function getMembersByTeam(teamId: string) {
  const members = await prisma.member.findMany({
    where: { teamId },
    orderBy: { nickname: "asc" },
  });

  return members;
}
