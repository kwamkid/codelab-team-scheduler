"use client";

import { startOfWeek, addDays, isSameDay, format } from "date-fns";
import { th } from "date-fns/locale";
import { ScheduleWithMember, Event } from "@/types";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
}

export default function WeekView({
  currentDate,
  schedules,
  events,
  onDayClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const getSchedulesForDay = (date: Date) =>
    schedules.filter((s) => isSameDay(new Date(s.date), date));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "p-3 text-center border-r last:border-r-0",
              isSameDay(day, today) && "bg-blue-50"
            )}
          >
            <div className="text-xs text-gray-500">
              {format(day, "EEE", { locale: th })}
            </div>
            <div
              className={cn(
                "text-lg font-semibold mt-1",
                isSameDay(day, today) && "text-blue-600"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 min-h-[400px]">
        {days.map((day) => {
          const daySchedules = getSchedulesForDay(day);
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "p-2 border-r last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors",
                isSameDay(day, today) && "bg-blue-50/50"
              )}
            >
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="mb-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs truncate"
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}

              {daySchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="mb-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs truncate"
                  title={`${schedule.member.nickname} ${schedule.startTime}-${schedule.endTime}`}
                >
                  {schedule.member.nickname}
                </div>
              ))}

              {daySchedules.length === 0 && dayEvents.length === 0 && (
                <div className="text-xs text-gray-400 text-center mt-4">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
