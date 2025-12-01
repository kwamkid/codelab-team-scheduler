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
  onSubmitRange?: (data: {
    memberId: string;
    startDate: string;
    endDate: string;
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
  onSubmitRange,
  onCancel,
}: ScheduleFormProps) {
  const isEditing = !!schedule;
  const [memberId, setMemberId] = useState(schedule?.memberId || "");
  const [startDate, setStartDate] = useState(
    schedule
      ? format(new Date(schedule.date), "yyyy-MM-dd")
      : initialDate
        ? format(initialDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
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

  // Calculate number of days in range
  const getDaysCount = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  const daysCount = getDaysCount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!memberId) {
      setError("กรุณาเลือกสมาชิก");
      return;
    }

    if (!startDate) {
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

    // For editing, endDate should equal startDate
    if (isEditing && endDate !== startDate) {
      setError("การแก้ไขสามารถแก้ได้ทีละวันเท่านั้น");
      return;
    }

    // Check valid date range
    if (!isEditing && endDate < startDate) {
      setError("วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");
      return;
    }

    setLoading(true);
    try {
      // If creating with date range (multiple days)
      if (!isEditing && startDate !== endDate && onSubmitRange) {
        await onSubmitRange({
          memberId,
          startDate,
          endDate,
          startTime,
          endTime,
          task: task || undefined,
        });
      } else {
        // Single day or editing
        await onSubmit({
          memberId,
          date: startDate,
          startTime,
          endTime,
          task: task || undefined,
        });
      }
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
        disabled={isEditing}
      />

      {isEditing ? (
        // Edit mode: single date
        <Input
          label="วันที่"
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setEndDate(e.target.value);
          }}
        />
      ) : (
        // Create mode: date range
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="วันที่เริ่ม"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              // If endDate is before startDate, set endDate = startDate
              if (e.target.value > endDate) {
                setEndDate(e.target.value);
              }
            }}
          />
          <Input
            label="วันที่สิ้นสุด"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      )}

      {/* Show days count when creating with range */}
      {!isEditing && daysCount > 1 && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          จะสร้างตาราง {daysCount} วัน (แต่ละวันจะเป็น record แยกกัน)
        </div>
      )}

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
          {loading ? "กำลังบันทึก..." : isEditing ? "บันทึก" : daysCount > 1 ? `สร้าง ${daysCount} รายการ` : "บันทึก"}
        </Button>
      </div>
    </form>
  );
}
