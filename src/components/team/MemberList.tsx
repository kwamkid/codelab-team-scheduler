"use client";

import { useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { Member } from "@/types";
import { addMember, updateMember, deleteMember } from "@/actions/member";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface MemberListProps {
  teamId: string;
  members: Member[];
}

export default function MemberList({ teamId, members }: MemberListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoading(true);
    setError("");

    const result = await addMember(teamId, nickname);
    if (result.error) {
      setError(result.error);
    } else {
      setShowAddModal(false);
      setNickname("");
    }
    setLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !nickname.trim()) return;

    setLoading(true);
    setError("");

    const result = await updateMember(editingMember.id, nickname);
    if (result.error) {
      setError(result.error);
    } else {
      setEditingMember(null);
      setNickname("");
    }
    setLoading(false);
  };

  const handleDelete = async (member: Member) => {
    if (!confirm(`ลบ "${member.nickname}" ออกจากทีม?`)) return;

    await deleteMember(member.id);
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
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{member.nickname}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setNickname(member.nickname);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNickname("");
          setError("");
        }}
        title="เพิ่มสมาชิก"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
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
          setError("");
        }}
        title="แก้ไขสมาชิก"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="ชื่อเล่น"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
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
