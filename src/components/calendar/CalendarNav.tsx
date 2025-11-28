"use client";

import { ChevronLeft, ChevronRight, Calendar, CalendarDays, CalendarRange, List } from "lucide-react";
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

const viewConfig = [
  { key: "day" as CalendarView, label: "วัน", icon: Calendar },
  { key: "week" as CalendarView, label: "สัปดาห์", icon: CalendarDays },
  { key: "month" as CalendarView, label: "เดือน", icon: CalendarRange },
  { key: "list" as CalendarView, label: "รายการ", icon: List },
];

export default function CalendarNav({
  currentDate,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarNavProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100/80 rounded-xl p-1 gap-1">
          {viewConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                view === key
                  ? "bg-white text-primary shadow-md font-medium"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onPrevious} className="rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-lg font-semibold min-w-[180px] text-center text-gray-700">
          {formatMonthYear(currentDate)}
        </span>
        <Button variant="ghost" size="sm" onClick={onNext} className="rounded-xl">
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="sm" onClick={onToday} className="rounded-xl ml-2">
          วันนี้
        </Button>
      </div>
    </div>
  );
}
