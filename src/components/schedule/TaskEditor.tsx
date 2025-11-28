"use client";

import { useState } from "react";
import { ScheduleWithMember } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface TaskEditorProps {
  schedule: ScheduleWithMember;
  onSubmit: (task: string) => Promise<void>;
  onCancel: () => void;
}

export default function TaskEditor({
  schedule,
  onSubmit,
  onCancel,
}: TaskEditorProps) {
  const [task, setTask] = useState(schedule.task || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(task);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{schedule.member.nickname}</span>
        <span className="mx-2">•</span>
        <span>
          {schedule.startTime} - {schedule.endTime}
        </span>
      </div>

      <Input
        label="หน้าที่"
        type="text"
        placeholder="เช่น ทำ Intake mechanism"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        autoFocus
      />

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          ยกเลิก
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </div>
    </form>
  );
}
