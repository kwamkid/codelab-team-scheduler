"use client";

import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { User, Calendar, Clock, Trash2 } from "lucide-react";
import { ScheduleWithMember } from "@/types";
import { getMemberColor } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface ScheduleDetailProps {
  schedule: ScheduleWithMember;
  onUpdate: (data: { task?: string }) => Promise<void>;
  onDelete: () => void;
  onClose: () => void;
}

export default function ScheduleDetail({
  schedule,
  onUpdate,
  onDelete,
  onClose,
}: ScheduleDetailProps) {
  const [task, setTask] = useState(schedule.task || "");
  const [loading, setLoading] = useState(false);

  const memberColor = getMemberColor(schedule.member.color);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate({ task: task || undefined });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`ลบตารางของ "${schedule.member.nickname}"?`)) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className="space-y-5">
      {/* Member Name - Read Only */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${memberColor.bg}`}
        >
          <User className={`w-6 h-6 ${memberColor.text}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">สมาชิก</p>
          <p className={`text-lg font-bold ${memberColor.text}`}>
            {schedule.member.nickname}
          </p>
        </div>
      </div>

      {/* Date & Time - Read Only */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-accent-blue-light/50 rounded-xl">
          <div className="flex items-center gap-2 text-accent-blue mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">วันที่</span>
          </div>
          <p className="text-gray-800 font-semibold">
            {format(new Date(schedule.date), "d MMMM yyyy", { locale: th })}
          </p>
        </div>
        <div className="p-3 bg-accent-purple-light/50 rounded-xl">
          <div className="flex items-center gap-2 text-accent-purple mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">เวลา</span>
          </div>
          <p className="text-gray-800 font-semibold">
            {schedule.startTime} - {schedule.endTime}
          </p>
        </div>
      </div>

      {/* Note - Editable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          บันทึก / หน้าที่
        </label>
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="เพิ่มบันทึกหรือหน้าที่..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          className="text-primary hover:bg-primary-light"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          ลบ
        </Button>
        <div className="flex-1" />
        <Button type="button" variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </div>
    </div>
  );
}
