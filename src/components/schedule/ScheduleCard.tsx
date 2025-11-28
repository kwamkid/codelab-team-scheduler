"use client";

import { Clock, ClipboardList, Pencil, Trash2 } from "lucide-react";
import { ScheduleWithMember } from "@/types";

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
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{schedule.member.nickname}</h4>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <Clock className="w-4 h-4" />
            <span>
              {schedule.startTime} - {schedule.endTime}
            </span>
          </div>
          {schedule.task ? (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <ClipboardList className="w-4 h-4" />
              <span>{schedule.task}</span>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1"
            >
              + เพิ่มหน้าที่
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
