"use client";

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

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {formatDateThai(date)}
      </h2>

      {dayEvents.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-orange-600 mb-2">
            กิจกรรมของทีม
          </h3>
          <div className="space-y-2">
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

      {daySchedules.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">
            สมาชิกที่มา ({daySchedules.length} คน)
          </h3>
          {daySchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={() => onEditSchedule(schedule)}
              onDelete={() => onDeleteSchedule(schedule.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          ยังไม่มีสมาชิกลงตารางในวันนี้
        </div>
      )}
    </div>
  );
}
