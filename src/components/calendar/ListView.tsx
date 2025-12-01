"use client";

import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfDay } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { ScheduleWithMember, Event } from "@/types";
import { cn } from "@/lib/utils";

// Helper to check if event is all-day (no time specified)
const isAllDayEvent = (event: Event) => !event.startTime && !event.endTime;

interface ListViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
  onScheduleClick?: (schedule: ScheduleWithMember) => void;
  onEventClick?: (event: Event) => void;
}

export default function ListView({
  currentDate,
  schedules,
  events,
  onDayClick,
  onScheduleClick,
  onEventClick,
}: ListViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = new Date();

  const getSchedulesForDay = (date: Date) =>
    schedules.filter((s) => isSameDay(new Date(s.date), date));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  // Filter days that have schedules or events
  const daysWithActivity = daysInMonth.filter((day) => {
    return getSchedulesForDay(day).length > 0 || getEventsForDay(day).length > 0;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          ประวัติการทำงาน - {format(currentDate, "MMMM yyyy", { locale: th })}
        </h3>
      </div>

      {daysWithActivity.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>ยังไม่มีข้อมูลในเดือนนี้</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {daysWithActivity.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, today);
            const isPast = isBefore(day, startOfDay(today));

            return (
              <div key={day.toISOString()}>
                {/* Date Header */}
                <div
                  onClick={() => onDayClick(day)}
                  className={cn(
                    "px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-100",
                    isPast ? "bg-gray-100" : "bg-gray-50",
                    isToday && "bg-yellow-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-semibold text-sm",
                      isPast ? "text-gray-400" : "text-gray-700"
                    )}>
                      {format(day, "EEE d MMM", { locale: th })}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded">
                        วันนี้
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {daySchedules.length + dayEvents.length} รายการ
                  </span>
                </div>

                {/* Records - 1 per row */}
                <div className={cn(
                  "divide-y divide-gray-100",
                  isPast && "bg-gray-50/50"
                )}>
                  {/* Events */}
                  {dayEvents.map((event) => (
                    <div
                      key={`event-${event.id}`}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50",
                        isPast && "opacity-60"
                      )}
                    >
                      <div className="w-24 shrink-0 text-xs text-gray-500">
                        {isAllDayEvent(event) ? "ตลอดวัน" : `${event.startTime || ""} ${event.endTime ? `- ${event.endTime}` : ""}`}
                      </div>
                      <div className="w-28 shrink-0 text-sm font-medium text-purple-600">
                        📌 กิจกรรม
                      </div>
                      <div className="flex-1 text-sm text-gray-700 truncate">
                        {event.title}
                      </div>
                    </div>
                  ))}

                  {/* Schedules */}
                  {daySchedules.map((schedule) => (
                    <div
                      key={`schedule-${schedule.id}`}
                      onClick={() => onScheduleClick?.(schedule)}
                      className={cn(
                        "px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50",
                        isPast && "opacity-60"
                      )}
                    >
                      <div className="w-24 shrink-0 text-xs text-gray-500 font-mono">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      <div className="w-28 shrink-0 text-sm font-medium text-gray-800">
                        {schedule.member.nickname}
                      </div>
                      <div className="flex-1 text-sm text-gray-600 truncate">
                        {schedule.task || <span className="text-gray-300">-</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
