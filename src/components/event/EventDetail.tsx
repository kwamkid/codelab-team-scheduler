"use client";

import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { Event } from "@/types";
import Button from "@/components/ui/Button";

interface EventDetailProps {
  event: Event;
  onUpdate: (data: { title?: string; description?: string }) => Promise<void>;
  onDelete: () => void;
  onClose: () => void;
}

export default function EventDetail({
  event,
  onUpdate,
  onDelete,
  onClose,
}: EventDetailProps) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onUpdate({
        title: title.trim(),
        description: description || undefined
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`ลบ Event "${event.title}"?`)) {
      onDelete();
      onClose();
    }
  };

  const hasTime = event.startTime || event.endTime;

  return (
    <div className="space-y-5">
      {/* Date & Time - Read Only */}
      <div className={`grid ${hasTime ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
        <div className="p-3 bg-accent-blue-light/50 rounded-xl">
          <div className="flex items-center gap-2 text-accent-blue mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">วันที่</span>
          </div>
          <p className="text-gray-800 font-semibold">
            {format(new Date(event.date), "d MMMM yyyy", { locale: th })}
          </p>
        </div>
        {hasTime && (
          <div className="p-3 bg-accent-purple-light/50 rounded-xl">
            <div className="flex items-center gap-2 text-accent-purple mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">เวลา</span>
            </div>
            <p className="text-gray-800 font-semibold">
              {event.startTime && event.endTime
                ? `${event.startTime} - ${event.endTime}`
                : event.startTime || event.endTime}
            </p>
          </div>
        )}
      </div>

      {/* Title - Editable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ชื่อ Event
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ชื่อ Event..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Description - Editable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รายละเอียด
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="เพิ่มรายละเอียด..."
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
