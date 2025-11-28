"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { startOfMonth, endOfMonth } from "date-fns";

export async function createEvent(data: {
  teamId: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}) {
  const team = await prisma.team.findUnique({ where: { id: data.teamId } });

  if (!team) {
    return { error: "ไม่พบทีม" };
  }

  if (!data.title.trim()) {
    return { error: "กรุณาใส่ชื่อ Event" };
  }

  const event = await prisma.event.create({
    data: {
      teamId: data.teamId,
      title: data.title.trim(),
      date: new Date(data.date),
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      description: data.description || null,
    },
  });

  revalidatePath(`/team/${team.code}`);
  return { success: true, event };
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }
) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { team: true },
  });

  if (!event) {
    return { error: "ไม่พบ Event" };
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title: data.title?.trim() ?? event.title,
      date: data.date ? new Date(data.date) : event.date,
      startTime:
        data.startTime !== undefined ? data.startTime || null : event.startTime,
      endTime:
        data.endTime !== undefined ? data.endTime || null : event.endTime,
      description:
        data.description !== undefined
          ? data.description || null
          : event.description,
    },
  });

  revalidatePath(`/team/${event.team.code}`);
  return { success: true, event: updatedEvent };
}

export async function deleteEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { team: true },
  });

  if (!event) {
    return { error: "ไม่พบ Event" };
  }

  await prisma.event.delete({ where: { id } });

  revalidatePath(`/team/${event.team.code}`);
  return { success: true };
}

export async function getEventsByMonth(
  teamId: string,
  year: number,
  month: number
) {
  const date = new Date(year, month - 1, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const events = await prisma.event.findMany({
    where: {
      teamId,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return events;
}
