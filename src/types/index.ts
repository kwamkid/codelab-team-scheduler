import { Team, Member, Schedule, Event } from "@prisma/client";

export type { Team, Member, Schedule, Event };

export type MemberWithSchedules = Member & {
  schedules: Schedule[];
};

export type TeamWithMembers = Team & {
  members: Member[];
};

export type TeamWithMembersAndEvents = Team & {
  members: MemberWithSchedules[];
  events: Event[];
};

export type ScheduleWithMember = Schedule & {
  member: Member;
};

export type CalendarView = "day" | "week" | "month";

export interface ScheduleFormData {
  memberId: string;
  date: string;
  startTime: string;
  endTime: string;
  task?: string;
}

export interface EventFormData {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface TeamFormData {
  name: string;
  code: string;
  adminCode: string;
}

export interface DaySchedule {
  date: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
}
