"use client";

import { Calendar, Clock, FileText, Pencil, Trash2, Star } from "lucide-react";
import { Event } from "@/types";
import { formatDateThai } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  showDate?: boolean;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  showDate = false,
}: EventCardProps) {
  // Check if event is all-day (no time specified)
  const isAllDay = !event.startTime && !event.endTime;

  return (
    <div className={cn(
      "rounded-xl p-4 border hover:shadow-md transition-all duration-200 group",
      isAllDay
        ? "bg-accent-pink-light/30 border-accent-pink/20 hover:border-accent-pink/40"
        : "bg-accent-purple-light/30 border-accent-purple/20 hover:border-accent-purple/40"
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isAllDay ? "bg-accent-pink/20" : "bg-accent-purple/20"
        )}>
          <Star className={cn(
            "w-5 h-5",
            isAllDay ? "text-accent-pink" : "text-accent-purple"
          )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800">{event.title}</h4>

          {showDate && (
            <div className={cn(
              "flex items-center gap-1.5 text-sm mt-1",
              isAllDay ? "text-accent-pink" : "text-accent-purple"
            )}>
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formatDateThai(new Date(event.date))}</span>
            </div>
          )}

          {isAllDay ? (
            <div className="flex items-center gap-1.5 text-sm text-accent-pink mt-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">ตลอดทั้งวัน</span>
            </div>
          ) : (event.startTime || event.endTime) && (
            <div className="flex items-center gap-1.5 text-sm text-accent-purple mt-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          )}

          {event.description && (
            <div className="flex items-start gap-1.5 text-sm text-gray-500 mt-1">
              <FileText className="w-4 h-4 mt-0.5" />
              <span>{event.description}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-accent-blue hover:bg-accent-blue-light rounded-lg transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
