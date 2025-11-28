"use client";

import { startOfWeek, addDays, isSameDay, isBefore, startOfDay, format } from "date-fns";
import { th } from "date-fns/locale";
import { ScheduleWithMember, Event } from "@/types";
import { cn, getMemberColor } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
  onAddSchedule?: (date: Date) => void;
  onScheduleClick?: (schedule: ScheduleWithMember) => void;
}

export default function WeekView({
  currentDate,
  schedules,
  events,
  onDayClick,
  onAddSchedule,
  onScheduleClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const getSchedulesForDay = (date: Date) =>
    schedules.filter((s) => isSameDay(new Date(s.date), date));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  // Helper to check if event is all-day (no time specified)
  const isAllDayEvent = (event: Event) => !event.startTime && !event.endTime;

  // Get all items for current week grouped by date
  const weekItemsByDate = days
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
      <div className="grid grid-cols-7 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50">
        {days.map((day) => {
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, startOfDay(today)) && !isToday;
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "p-4 text-center border-r border-white/50 last:border-r-0",
                isToday && "bg-accent-yellow-light/50",
                isPast && "bg-gray-100/50"
              )}
            >
              <div className={cn(
                "text-xs font-medium",
                isPast ? "text-gray-400" : isWeekend ? "text-accent-pink" : "text-gray-500"
              )}>
                {format(day, "EEE", { locale: th })}
              </div>
              <div
                className={cn(
                  "text-xl font-bold mt-1 w-10 h-10 flex items-center justify-center mx-auto rounded-xl transition-all",
                  isToday && "bg-linear-to-br from-primary to-accent-orange text-white shadow-md shadow-primary/30",
                  !isToday && isPast && "text-gray-400",
                  !isToday && !isPast && isWeekend && "text-accent-pink"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 min-h-[400px]">
        {days.map((day) => {
          const daySchedules = getSchedulesForDay(day);
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, startOfDay(today)) && !isToday;

          return (
            <div
              key={day.toISOString()}
              onClick={() => onAddSchedule ? onAddSchedule(day) : onDayClick(day)}
              className={cn(
                "p-2 border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-accent-blue-light/30 transition-all duration-200",
                isToday && "bg-accent-yellow-light/30",
                isPast && "bg-gray-50/70"
              )}
            >
              {/* 2-column grid for items */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ...dayEvents.map((e) => ({ type: "event" as const, data: e })),
                  ...daySchedules.map((s) => ({ type: "schedule" as const, data: s })),
                ]
                  .slice(0, 4)
                  .map((item) =>
                    item.type === "event" ? (
                      <div
                        key={item.data.id}
                        className={cn(
                          "px-2 py-2 rounded-lg text-xs truncate font-medium shadow-sm",
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
                          "px-2 py-2 rounded-lg text-xs truncate font-medium shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
                          getMemberColor(item.data.member.color).bg,
                          getMemberColor(item.data.member.color).text
                        )}
                        title={`${item.data.member.nickname} ${item.data.startTime}-${item.data.endTime}`}
                      >
                        {item.data.member.nickname}
                      </div>
                    )
                  )}
              </div>

              {daySchedules.length + dayEvents.length > 4 && (
                <div className="text-xs text-gray-400 font-medium text-center mt-1">
                  +{daySchedules.length + dayEvents.length - 4} อื่นๆ
                </div>
              )}

              {daySchedules.length === 0 && dayEvents.length === 0 && (
                <div className="text-xs text-gray-300 text-center mt-8">-</div>
              )}
            </div>
          );
        })}
      </div>
      </div>

      {/* Mobile: List below calendar grouped by date */}
      {weekItemsByDate.length > 0 && (
        <div className="sm:hidden mt-4 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-3 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">รายการสัปดาห์นี้</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {weekItemsByDate.map((group) => {
              const isPastDate = isBefore(group.date, startOfDay(today));
              const isGroupToday = isSameDay(group.date, today);

              return (
                <div key={group.date.toISOString()}>
                  {/* Date Header */}
                  <div
                    className={cn(
                      "px-3 py-2 bg-gray-50 border-b border-gray-100 sticky top-0",
                      isGroupToday && "bg-accent-yellow-light"
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isPastDate ? "text-gray-400" : "text-gray-700"
                      )}
                    >
                      {format(group.date, "EEEE d MMMM", { locale: th })}
                      {isGroupToday && (
                        <span className="ml-2 text-xs font-medium text-accent-orange">
                          วันนี้
                        </span>
                      )}
                    </p>
                  </div>
                  {/* Items for this date */}
                  <div className="divide-y divide-gray-100">
                    {group.items.map((item) =>
                      item.type === "event" ? (
                        <div
                          key={`event-${item.data.id}`}
                          className={cn(
                            "px-3 py-3 flex items-center gap-3",
                            isPastDate && "opacity-50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full shrink-0",
                              isAllDayEvent(item.data)
                                ? "bg-accent-pink"
                                : "bg-accent-purple"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.data.title}
                            </p>
                            {item.data.startTime && (
                              <p className="text-xs text-gray-500">
                                {item.data.startTime}
                                {item.data.endTime && ` - ${item.data.endTime}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          key={`schedule-${item.data.id}`}
                          onClick={() => onScheduleClick?.(item.data)}
                          className={cn(
                            "px-3 py-3 flex items-center gap-3 cursor-pointer active:bg-gray-50",
                            isPastDate && "opacity-50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full shrink-0",
                              getMemberColor(item.data.member.color).dot
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                getMemberColor(item.data.member.color).text
                              )}
                            >
                              {item.data.member.nickname}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs text-gray-500 shrink-0">
                                {item.data.startTime} - {item.data.endTime}
                              </p>
                              {item.data.task && (
                                <p className="text-xs text-gray-400 truncate">
                                  {item.data.task}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
