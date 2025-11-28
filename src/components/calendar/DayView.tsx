"use client";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar, Users } from "lucide-react";
import { formatDateThai } from "@/lib/utils";
import { ScheduleWithMember, Event } from "@/types";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import EventCard from "@/components/event/EventCard";

interface DayViewProps {
  date: Date;
  schedules: ScheduleWithMember[];
  events: Event[];
  onEditSchedule: (schedule: ScheduleWithMember) => void;
  onDeleteSchedule: (id: string) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
}

export default function DayView({
  date,
  schedules,
  events,
  onEditSchedule,
  onDeleteSchedule,
  onEditEvent,
  onDeleteEvent,
}: DayViewProps) {
  const dayEvents = events.filter(
    (e) => new Date(e.date).toDateString() === date.toDateString()
  );

  const daySchedules = schedules.filter(
    (s) => new Date(s.date).toDateString() === date.toDateString()
  );

  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold ${
            isToday
              ? "bg-linear-to-br from-primary to-accent-orange text-white shadow-lg shadow-primary/30"
              : "bg-white text-gray-700 shadow-md"
          }`}>
            <span className="text-2xl leading-none">{format(date, "d")}</span>
            <span className="text-xs font-medium opacity-80">{format(date, "EEE", { locale: th })}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {formatDateThai(date)}
            </h2>
            <p className="text-sm text-gray-500">
              {format(date, "EEEE", { locale: th })}
              {isToday && <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">วันนี้</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Events Section */}
        {dayEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-purple-light flex items-center justify-center">
                <Calendar className="w-4 h-4 text-accent-purple" />
              </div>
              <h3 className="font-semibold text-accent-purple">
                กิจกรรมของทีม
              </h3>
            </div>
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => onEditEvent(event)}
                  onDelete={() => onDeleteEvent(event.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Schedules Section */}
        {daySchedules.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-teal-light flex items-center justify-center">
                <Users className="w-4 h-4 text-accent-teal" />
              </div>
              <h3 className="font-semibold text-accent-teal">
                สมาชิกที่มา ({daySchedules.length} คน)
              </h3>
            </div>
            <div className="space-y-3">
              {daySchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={() => onEditSchedule(schedule)}
                  onDelete={() => onDeleteSchedule(schedule.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">ยังไม่มีสมาชิกลงตารางในวันนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
