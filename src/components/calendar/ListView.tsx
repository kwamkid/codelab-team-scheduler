"use client";

import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar, Clock, Star } from "lucide-react";
import { ScheduleWithMember, Event } from "@/types";
import { cn, getMemberColor } from "@/lib/utils";

// Helper to check if event is all-day (no time specified)
const isAllDayEvent = (event: Event) => !event.startTime && !event.endTime;

interface ListViewProps {
  currentDate: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onDayClick: (date: Date) => void;
}

export default function ListView({
  currentDate,
  schedules,
  events,
  onDayClick,
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
      <div className="p-4 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent-purple" />
          รายการกิจกรรมในเดือนนี้
        </h3>
      </div>

      {daysWithActivity.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีกิจกรรมในเดือนนี้</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {daysWithActivity.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, today);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={day.toISOString()}
                onClick={() => onDayClick(day)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-accent-blue-light/20 transition-all duration-200",
                  isToday && "bg-accent-yellow-light/30"
                )}
              >
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold",
                      isToday
                        ? "bg-linear-to-br from-primary to-accent-orange text-white shadow-md shadow-primary/30"
                        : isWeekend
                        ? "bg-accent-pink-light text-accent-pink"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <span className="text-lg leading-none">{format(day, "d")}</span>
                    <span className="text-[10px] font-medium opacity-80">
                      {format(day, "EEE", { locale: th })}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium",
                      isToday ? "text-primary" : "text-gray-700"
                    )}>
                      {format(day, "EEEE", { locale: th })}
                    </p>
                    <p className="text-sm text-gray-400">
                      {format(day, "d MMMM yyyy", { locale: th })}
                    </p>
                  </div>
                  {isToday && (
                    <span className="ml-auto px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      วันนี้
                    </span>
                  )}
                </div>

                {/* Events */}
                {dayEvents.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {dayEvents.map((event) => {
                      const allDay = isAllDayEvent(event);
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl",
                            allDay ? "bg-accent-pink-light" : "bg-accent-purple-light"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            allDay ? "bg-accent-pink/20" : "bg-accent-purple/20"
                          )}>
                            {allDay ? (
                              <Star className="w-5 h-5 text-accent-pink" />
                            ) : (
                              <Calendar className="w-5 h-5 text-accent-purple" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium truncate",
                              allDay ? "text-accent-pink" : "text-accent-purple"
                            )}>
                              {event.title}
                            </p>
                            {allDay ? (
                              <p className="text-sm text-accent-pink/70">ตลอดทั้งวัน</p>
                            ) : (
                              <p className="text-sm text-accent-purple/70 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.startTime}
                                {event.endTime && ` - ${event.endTime}`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Schedules */}
                {daySchedules.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {daySchedules.map((schedule) => {
                      const memberColor = getMemberColor(schedule.member.color);
                      return (
                        <div
                          key={schedule.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl",
                            memberColor.bg
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                            memberColor.dot
                          )}>
                            {schedule.member.nickname.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("font-medium text-sm", memberColor.text)}>
                              {schedule.member.nickname}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn("text-xs opacity-70 shrink-0", memberColor.text)}>
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                              {schedule.task && (
                                <p className="text-xs text-gray-500 truncate">
                                  {schedule.task}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
