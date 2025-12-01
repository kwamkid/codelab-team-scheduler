"use client";

import { useState } from "react";
import { isBefore, isSameDay, startOfDay, format } from "date-fns";
import { th } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { ScheduleWithMember, Event } from "@/types";
import { cn } from "@/lib/utils";

interface DateAccordionProps {
  date: Date;
  items: Array<
    | { type: "event"; data: Event }
    | { type: "schedule"; data: ScheduleWithMember }
  >;
  today: Date;
  onScheduleClick?: (schedule: ScheduleWithMember) => void;
  onEventClick?: (event: Event) => void;
}

// Helper to check if event is all-day
const isAllDayEvent = (event: Event) => !event.startTime && !event.endTime;

export default function DateAccordion({
  date,
  items,
  today,
  onScheduleClick,
  onEventClick,
}: DateAccordionProps) {
  const isPastDate = isBefore(date, startOfDay(today));
  const isToday = isSameDay(date, today);

  // Past dates start collapsed, today and future dates start expanded
  const [isOpen, setIsOpen] = useState(!isPastDate);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Date Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-2 flex items-center justify-between gap-2 transition-colors text-left",
          isToday
            ? "bg-yellow-50 hover:bg-yellow-100"
            : isPastDate
            ? "bg-gray-100 hover:bg-gray-150"
            : "bg-gray-50 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-semibold",
              isPastDate ? "text-gray-400" : "text-gray-700"
            )}
          >
            {format(date, "EEE d MMM", { locale: th })}
          </span>
          {isToday && (
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded">
              วันนี้
            </span>
          )}
          <span className="text-xs text-gray-400">
            ({items.length} รายการ)
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Items - Collapsible */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[1000px]" : "max-h-0"
        )}
      >
        <div className={cn(
          "divide-y divide-gray-100",
          isPastDate && "bg-gray-50/50"
        )}>
          {items.map((item) =>
            item.type === "event" ? (
              <div
                key={`event-${item.data.id}`}
                onClick={() => onEventClick?.(item.data)}
                className={cn(
                  "px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50",
                  isPastDate && "opacity-50"
                )}
              >
                <div className="w-24 shrink-0 text-xs text-gray-500">
                  {isAllDayEvent(item.data)
                    ? "ตลอดวัน"
                    : `${item.data.startTime || ""}${item.data.endTime ? ` - ${item.data.endTime}` : ""}`
                  }
                </div>
                <div className="w-28 shrink-0 text-sm text-gray-500">
                  กิจกรรม
                </div>
                <div className="flex-1 text-sm text-gray-700 truncate">
                  {item.data.title}
                </div>
              </div>
            ) : (
              <div
                key={`schedule-${item.data.id}`}
                onClick={() => onScheduleClick?.(item.data)}
                className={cn(
                  "px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50",
                  isPastDate && "opacity-50"
                )}
              >
                <div className="w-24 shrink-0 text-xs text-gray-500 font-mono">
                  {item.data.startTime} - {item.data.endTime}
                </div>
                <div className="w-28 shrink-0 text-sm font-medium text-gray-800">
                  {item.data.member.nickname}
                </div>
                <div className="flex-1 text-sm text-gray-600 truncate">
                  {item.data.task || <span className="text-gray-300">-</span>}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
