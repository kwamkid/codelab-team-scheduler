"use client";

import { Calendar, Clock, FileText, Pencil, Trash2 } from "lucide-react";
import { Event } from "@/types";
import { formatDateThai } from "@/lib/utils";

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
  return (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-orange-900">{event.title}</h4>

          {showDate && (
            <div className="flex items-center gap-1 text-sm text-orange-700 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDateThai(new Date(event.date))}</span>
            </div>
          )}

          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-1 text-sm text-orange-700 mt-1">
              <Clock className="w-4 h-4" />
              <span>
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          )}

          {event.description && (
            <div className="flex items-start gap-1 text-sm text-orange-700 mt-1">
              <FileText className="w-4 h-4 mt-0.5" />
              <span>{event.description}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-orange-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
