"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export async function createSchedule(data: {
  memberId: string;
  date: string;
  startTime: string;
  endTime: string;
  task?: string;
}) {
  const member = await prisma.member.findUnique({
    where: { id: data.memberId },
    include: { team: true },
  });

  if (!member) {
    return { error: "ไม่พบสมาชิก" };
  }

  const schedule = await prisma.schedule.create({
    data: {
      memberId: data.memberId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      task: data.task || null,
    },
  });

  revalidatePath(`/team/${member.team.code}`);
  return { success: true, schedule };
}

export async function updateSchedule(
  id: string,
  data: {
    startTime?: string;
    endTime?: string;
    task?: string;
  }
) {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { member: { include: { team: true } } },
  });

  if (!schedule) {
    return { error: "ไม่พบตาราง" };
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      startTime: data.startTime ?? schedule.startTime,
      endTime: data.endTime ?? schedule.endTime,
      task: data.task !== undefined ? data.task || null : schedule.task,
    },
  });

  revalidatePath(`/team/${schedule.member.team.code}`);
  return { success: true, schedule: updatedSchedule };
}

export async function deleteSchedule(id: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: { member: { include: { team: true } } },
  });

  if (!schedule) {
    return { error: "ไม่พบตาราง" };
  }

  await prisma.schedule.delete({ where: { id } });

  revalidatePath(`/team/${schedule.member.team.code}`);
  return { success: true };
}

export async function getSchedulesByDate(teamId: string, date: Date) {
  const schedules = await prisma.schedule.findMany({
    where: {
      member: { teamId },
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    include: { member: true },
    orderBy: { startTime: "asc" },
  });

  return schedules;
}

export async function getSchedulesByWeek(teamId: string, date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  const schedules = await prisma.schedule.findMany({
    where: {
      member: { teamId },
      date: {
        gte: start,
        lte: end,
      },
    },
    include: { member: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return schedules;
}

export async function getSchedulesByMonth(
  teamId: string,
  year: number,
  month: number
) {
  const date = new Date(year, month - 1, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const schedules = await prisma.schedule.findMany({
    where: {
      member: { teamId },
      date: {
        gte: start,
        lte: end,
      },
    },
    include: { member: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return schedules;
}
