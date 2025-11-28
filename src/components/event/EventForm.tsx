"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Event } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface EventFormProps {
  initialDate?: Date;
  event?: Event;
  onSubmit: (data: {
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({
  initialDate,
  event,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(
    event
      ? format(new Date(event.date), "yyyy-MM-dd")
      : initialDate
        ? format(initialDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState(event?.startTime || "");
  const [endTime, setEndTime] = useState(event?.endTime || "");
  const [description, setDescription] = useState(event?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("กรุณาใส่ชื่อ Event");
      return;
    }

    if (!date) {
      setError("กรุณาเลือกวันที่");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setError("เวลาเริ่มต้องน้อยกว่าเวลาจบ");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        date,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        description: description.trim() || undefined,
      });
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="ชื่อ Event"
        type="text"
        placeholder="เช่น วันแข่ง Regional"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <Input
        label="วันที่"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="เวลาเริ่ม (ไม่บังคับ)"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="เวลาจบ (ไม่บังคับ)"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รายละเอียด (ไม่บังคับ)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={3}
          placeholder="เช่น แข่งที่ BITEC Hall 101"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

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
