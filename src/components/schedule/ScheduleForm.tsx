"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Member, ScheduleWithMember } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface ScheduleFormProps {
  members: Member[];
  initialDate?: Date;
  schedule?: ScheduleWithMember;
  onSubmit: (data: {
    memberId: string;
    date: string;
    startTime: string;
    endTime: string;
    task?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ScheduleForm({
  members,
  initialDate,
  schedule,
  onSubmit,
  onCancel,
}: ScheduleFormProps) {
  const [memberId, setMemberId] = useState(schedule?.memberId || "");
  const [date, setDate] = useState(
    schedule
      ? format(new Date(schedule.date), "yyyy-MM-dd")
      : initialDate
        ? format(initialDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState(schedule?.startTime || "09:00");
  const [endTime, setEndTime] = useState(schedule?.endTime || "12:00");
  const [task, setTask] = useState(schedule?.task || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!memberId) {
      setError("กรุณาเลือกสมาชิก");
      return;
    }

    if (!date) {
      setError("กรุณาเลือกวันที่");
      return;
    }

    if (!startTime || !endTime) {
      setError("กรุณาใส่เวลา");
      return;
    }

    if (startTime >= endTime) {
      setError("เวลาเริ่มต้องน้อยกว่าเวลาจบ");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        memberId,
        date,
        startTime,
        endTime,
        task: task || undefined,
      });
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const memberOptions = members.map((m) => ({
    value: m.id,
    label: m.nickname,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Select
        label="สมาชิก"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        options={memberOptions}
        placeholder="เลือกชื่อ"
        disabled={!!schedule}
      />

      <Input
        label="วันที่"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="เวลาเริ่ม"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="เวลาจบ"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <Input
        label="หน้าที่ (ไม่บังคับ)"
        type="text"
        placeholder="เช่น ทำ Intake mechanism"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <div className="flex gap-3 pt-2">
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
