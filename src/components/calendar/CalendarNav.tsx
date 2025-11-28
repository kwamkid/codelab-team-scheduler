"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "@/lib/utils";
import { CalendarView } from "@/types";
import Button from "@/components/ui/Button";

interface CalendarNavProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarNav({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarNavProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === v
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {v === "day" ? "วัน" : v === "week" ? "สัปดาห์" : "เดือน"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onPrevious}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-lg font-medium min-w-[180px] text-center">
          {formatMonthYear(currentDate)}
        </span>
        <Button variant="ghost" size="sm" onClick={onNext}>
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="sm" onClick={onToday}>
          วันนี้
        </Button>
      </div>
    </div>
  );
}
