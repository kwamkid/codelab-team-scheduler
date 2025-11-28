"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import { th } from "date-fns/locale";
import { ScheduleWithMember, Event } from "@/types";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  schedules,
  events,
  onDayClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const today = new Date();
  const weekDays = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

  const getSchedulesForDay = (date: Date) =>
    schedules.filter((s) => isSameDay(new Date(s.date), date));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {weekDays.map((dayName) => (
          <div
            key={dayName}
            className="p-3 text-center text-sm font-medium text-gray-600"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const daySchedules = getSchedulesForDay(day);
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              className={cn(
                "min-h-[100px] p-2 border-b border-r cursor-pointer hover:bg-gray-50 transition-colors",
                !isCurrentMonth && "bg-gray-50",
                isToday && "bg-blue-50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-gray-400",
                    isToday &&
                      "w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full"
                  )}
                >
                  {format(day, "d")}
                </span>
                {daySchedules.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {daySchedules.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded truncate"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {daySchedules.slice(0, 2).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded truncate"
                    title={schedule.member.nickname}
                  >
                    {schedule.member.nickname}
                  </div>
                ))}
                {daySchedules.length + dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{daySchedules.length + dayEvents.length - 2} อื่นๆ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
