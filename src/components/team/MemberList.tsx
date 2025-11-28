"use client";

import { useState } from "react";
import { Pencil, Trash2, UserPlus, Check } from "lucide-react";
import { Member } from "@/types";
import { addMember, updateMember, deleteMember } from "@/actions/member";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { MEMBER_COLORS, getMemberColor, cn } from "@/lib/utils";

interface MemberListProps {
  teamId: string;
  members: Member[];
  onMembersChange?: () => void;
}

// Color Picker Component
function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        เลือกสีประจำตัว
      </label>
      <div className="grid grid-cols-6 gap-2">
        {MEMBER_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color.id)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border-2",
              color.bg,
              value === color.id
                ? `${color.border} ring-2 ring-offset-2 ring-${color.id}-400`
                : "border-transparent hover:scale-110"
            )}
            title={color.name}
          >
            {value === color.id && (
              <Check className={cn("w-5 h-5", color.text)} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MemberList({ teamId, members, onMembersChange }: MemberListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [nickname, setNickname] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoading(true);
    setError("");

    const result = await addMember(teamId, nickname, selectedColor);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddModal(false);
      setNickname("");
      setSelectedColor("blue");
      onMembersChange?.();
    }
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !nickname.trim()) return;

    setLoading(true);
    setError("");

    const result = await updateMember(editingMember.id, nickname, selectedColor);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingMember(null);
      setNickname("");
      setSelectedColor("blue");
      onMembersChange?.();
    }
    setLoading(false);
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`ลบ "${member.nickname}" ออกจากทีม?`)) return;

    await deleteMember(member.id);
    onMembersChange?.();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">สมาชิก ({members.length} คน)</h2>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          เพิ่มสมาชิก
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          ยังไม่มีสมาชิก กดปุ่ม "เพิ่มสมาชิก" เพื่อเริ่มต้น
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const color = getMemberColor(member.color);
            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all duration-200 border",
                  color.bg,
                  color.border,
                  "hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                      color.dot,
                      "text-white"
                    )}
                  >
                    {member.nickname.charAt(0).toUpperCase()}
                  </div>
                  <span className={cn("font-medium", color.text)}>
                    {member.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setNickname(member.nickname);
                      setSelectedColor(member.color);
                    }}
                    className="p-2 text-gray-500 hover:text-accent-blue hover:bg-white rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNickname("");
          setSelectedColor("blue");
          setError("");
        }}
        title="เพิ่มสมาชิก"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="p-3 bg-primary-light text-primary rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="ชื่อเล่น"
            placeholder="เช่น น้องมิว"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingMember}
        onClose={() => {
          setEditingMember(null);
          setNickname("");
          setSelectedColor("blue");
          setError("");
        }}
        title="แก้ไขสมาชิก"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {error && (
            <div className="p-3 bg-primary-light text-primary rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="ชื่อเล่น"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingMember(null)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
