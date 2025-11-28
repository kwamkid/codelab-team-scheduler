"use client";

import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ยังไม่มี Event ในเดือนนี้
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          showDate
          onEdit={() => onEdit(event)}
          onDelete={() => onDelete(event.id)}
        />
      ))}
    </div>
  );
}
