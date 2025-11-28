"use client";

import { Clock, ClipboardList, Pencil, Trash2 } from "lucide-react";
import { ScheduleWithMember } from "@/types";
import { getMemberColor, cn } from "@/lib/utils";

interface ScheduleCardProps {
  schedule: ScheduleWithMember;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: ScheduleCardProps) {
  const color = getMemberColor(schedule.member.color);

  return (
    <div className={cn(
      "rounded-xl p-4 border hover:shadow-md transition-all duration-200 group",
      color.bg,
      color.border
    )}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold",
          color.dot
        )}>
          {schedule.member.nickname.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold", color.text)}>
            {schedule.member.nickname}
          </h4>
          <div className={cn("flex items-center gap-1.5 text-sm mt-1", color.text)}>
            <Clock className="w-4 h-4" />
            <span className="font-medium">
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
          {schedule.task ? (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <ClipboardList className="w-4 h-4" />
              <span>{schedule.task}</span>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className={cn("text-sm font-medium mt-1 hover:underline", color.text)}
            >
              + เพิ่มหน้าที่
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-accent-blue hover:bg-white rounded-lg transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
