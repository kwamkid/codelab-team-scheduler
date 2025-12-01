"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
  format,
} from "date-fns";
import { th } from "date-fns/locale";
import { ScheduleWithMember, Event } from "@/types";
import { cn, getMemberColor } from "@/lib/utils";
import DateAccordion from "./DateAccordion";

interface MonthViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
  onAddSchedule?: (date: Date) => void;
  onScheduleClick?: (schedule: ScheduleWithMember) => void;
  onEventClick?: (event: Event) => void;
}

export default function MonthView({
  currentDate,
  schedules,
  events,
  onDayClick,
  onAddSchedule,
  onScheduleClick,
  onEventClick,
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

  // Helper to check if event is all-day (no time specified)
  const isAllDayEvent = (event: Event) => !event.startTime && !event.endTime;

  // Calculate number of weeks to ensure consistent row heights
  const totalWeeks = Math.ceil(days.length / 7);

  // Get all items for current month grouped by date
  const monthItemsByDate = days
    .filter((d) => isSameMonth(d, currentDate))
    .map((d) => {
      const daySchedules = getSchedulesForDay(d);
      const dayEvents = getEventsForDay(d);
      const items = [
        ...dayEvents.map((e) => ({ type: "event" as const, data: e })),
        ...daySchedules.map((s) => ({ type: "schedule" as const, data: s })),
      ];
      return { date: d, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header - Weekdays */}
      <div className="grid grid-cols-7 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50">
        {weekDays.map((dayName, idx) => (
          <div
            key={dayName}
            className={cn(
              "p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold",
              idx === 5 || idx === 6 ? "text-accent-pink" : "text-gray-600"
            )}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7"
        style={{ gridTemplateRows: `repeat(${totalWeeks}, minmax(80px, 1fr))` }}
      >
        {days.map((day, index) => {
          const daySchedules = getSchedulesForDay(day);
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, startOfDay(today)) && !isToday;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const hasItems = daySchedules.length > 0 || dayEvents.length > 0;
          const isLastRow = index >= days.length - 7;
          const isLastColumn = (index + 1) % 7 === 0;

          return (
            <div
              key={index}
              onClick={() => onAddSchedule ? onAddSchedule(day) : onDayClick(day)}
              className={cn(
                "min-h-[80px] sm:min-h-[110px] p-1 sm:p-2 cursor-pointer hover:bg-accent-blue-light/30 transition-all duration-200",
                !isLastRow && "border-b border-gray-100",
                !isLastColumn && "border-r border-gray-100",
                !isCurrentMonth && "bg-gray-50/50",
                isPast && isCurrentMonth && "bg-gray-50/70",
                isToday && "bg-linear-to-br from-accent-yellow-light/50 to-accent-orange-light/50"
              )}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg transition-all",
                    !isCurrentMonth && "text-gray-300",
                    isCurrentMonth && isPast && "text-gray-400",
                    isCurrentMonth && isWeekend && !isPast && "text-accent-pink",
                    isCurrentMonth && isWeekend && isPast && "text-gray-400",
                    isToday &&
                      "bg-linear-to-br from-primary to-accent-orange text-white shadow-md shadow-primary/30"
                  )}
                >
                  {format(day, "d")}
                </span>
                {/* Badge for mobile */}
                {hasItems && (
                  <span className="sm:hidden w-2 h-2 bg-accent-blue rounded-full" />
                )}
                {/* Badge count for desktop */}
                {daySchedules.length > 0 && (
                  <span className="hidden sm:inline text-xs bg-accent-blue-light text-accent-blue font-medium px-2 py-0.5 rounded-full">
                    {daySchedules.length}
                  </span>
                )}
              </div>

              {/* Events & Schedules - Hidden on mobile, show on larger screens */}
              <div className="hidden sm:grid grid-cols-2 gap-1">
                {/* Combine events and schedules, take first 4 */}
                {[
                  ...dayEvents.map((e) => ({ type: "event" as const, data: e })),
                  ...daySchedules.map((s) => ({ type: "schedule" as const, data: s })),
                ]
                  .slice(0, 4)
                  .map((item) =>
                    item.type === "event" ? (
                      <div
                        key={item.data.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(item.data);
                        }}
                        className={cn(
                          "text-xs px-2 py-1 rounded-lg truncate font-medium shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
                          isAllDayEvent(item.data)
                            ? "bg-accent-pink-light text-accent-pink"
                            : "bg-accent-purple-light text-accent-purple"
                        )}
                        title={item.data.title}
                      >
                        {item.data.title}
                      </div>
                    ) : (
                      <div
                        key={item.data.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleClick?.(item.data);
                        }}
                        className={cn(
                          "text-xs px-2 py-1 rounded-lg truncate font-medium cursor-pointer hover:opacity-80 transition-opacity shadow-sm",
                          getMemberColor(item.data.member.color).bg,
                          getMemberColor(item.data.member.color).text
                        )}
                        title={item.data.member.nickname}
                      >
                        {item.data.member.nickname}
                      </div>
                    )
                  )}
                {daySchedules.length + dayEvents.length > 4 && (
                  <div className="text-xs text-gray-400 font-medium col-span-2 text-center">
                    +{daySchedules.length + dayEvents.length - 4} อื่นๆ
                  </div>
                )}
              </div>

              {/* Mobile: Show text items */}
              <div className="sm:hidden space-y-0.5 mt-1">
                {[
                  ...dayEvents.map((e) => ({ type: "event" as const, data: e })),
                  ...daySchedules.map((s) => ({ type: "schedule" as const, data: s })),
                ]
                  .slice(0, 2)
                  .map((item) =>
                    item.type === "event" ? (
                      <div
                        key={item.data.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(item.data);
                        }}
                        className={cn(
                          "text-[10px] px-1 py-0.5 rounded truncate font-medium leading-tight cursor-pointer",
                          isAllDayEvent(item.data)
                            ? "bg-accent-pink-light text-accent-pink"
                            : "bg-accent-purple-light text-accent-purple"
                        )}
                      >
                        {item.data.title}
                      </div>
                    ) : (
                      <div
                        key={item.data.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleClick?.(item.data);
                        }}
                        className={cn(
                          "text-[10px] px-1 py-0.5 rounded truncate font-medium leading-tight cursor-pointer",
                          getMemberColor(item.data.member.color).bg,
                          getMemberColor(item.data.member.color).text
                        )}
                      >
                        {item.data.member.nickname}
                      </div>
                    )
                  )}
                {daySchedules.length + dayEvents.length > 2 && (
                  <div className="text-[10px] text-gray-400 font-medium text-center">
                    +{daySchedules.length + dayEvents.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* List below calendar grouped by date - Accordion style */}
      {monthItemsByDate.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-accent-blue-light/50 to-accent-purple-light/50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">รายการเดือนนี้</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {monthItemsByDate.map((group) => (
              <DateAccordion
                key={group.date.toISOString()}
                date={group.date}
                items={group.items}
                today={today}
                onScheduleClick={onScheduleClick}
                onEventClick={onEventClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
