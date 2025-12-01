"use client";

import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  onClick: (event: Event) => void;
  onDelete: (id: string) => void;
}

export default function EventList({ events, onClick, onDelete }: EventListProps) {
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
          onClick={() => onClick(event)}
          onDelete={() => onDelete(event.id)}
        />
      ))}
    </div>
  );
}
