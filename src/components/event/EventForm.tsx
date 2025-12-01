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
  onSubmitRange?: (data: {
    title: string;
    startDate: string;
    endDate: string;
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
  onSubmitRange,
  onCancel,
}: EventFormProps) {
  const isEditing = !!event;
  const [title, setTitle] = useState(event?.title || "");
  const [startDate, setStartDate] = useState(
    event
      ? format(new Date(event.date), "yyyy-MM-dd")
      : initialDate
        ? format(initialDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
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

    if (!title.trim()) {
      setError("กรุณาใส่ชื่อ Event");
      return;
    }

    if (!startDate) {
      setError("กรุณาเลือกวันที่");
      return;
    }

    if (startTime && endTime && startTime >= endTime) {
      setError("เวลาเริ่มต้องน้อยกว่าเวลาจบ");
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
          title: title.trim(),
          startDate,
          endDate,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          description: description.trim() || undefined,
        });
      } else {
        // Single day or editing
        await onSubmit({
          title: title.trim(),
          date: startDate,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          description: description.trim() || undefined,
        });
      }
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
          จะสร้าง Event {daysCount} วัน (แต่ละวันจะเป็น record แยกกัน)
        </div>
      )}

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
          {loading ? "กำลังบันทึก..." : isEditing ? "บันทึก" : daysCount > 1 ? `สร้าง ${daysCount} รายการ` : "บันทึก"}
        </Button>
      </div>
    </form>
  );
}
