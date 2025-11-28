"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  ExternalLink,
  Trash2,
  LogOut,
  Search,
  Copy,
  Check,
  Shield,
  Edit3,
  UserCog,
  Plus,
} from "lucide-react";
import { deleteTeam, updateTeamName, createTeam, getTeamMembers } from "@/actions/admin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import MemberList from "@/components/team/MemberList";
import { Member } from "@/types";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  _count: {
    members: number;
    events: number;
  };
}

interface AdminDashboardProps {
  teams: Team[];
}

export default function AdminDashboard({ teams }: AdminDashboardProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamCode, setNewTeamCode] = useState("");
  const [createError, setCreateError] = useState("");
  const [managingMembersTeam, setManagingMembersTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleDelete = async (team: Team) => {
    if (
      !confirm(
        `ลบทีม "${team.name}" (${team.code})?\n\nจะลบสมาชิกและตารางทั้งหมดของทีมนี้ด้วย!`
      )
    )
      return;

    await deleteTeam(team.id);
    router.refresh();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/team/${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(`link-${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditName(team.name);
  };

  const handleSaveTeamName = async () => {
    if (!editingTeam || !editName.trim()) return;
    setSaving(true);
    await updateTeamName(editingTeam.id, editName.trim());
    setSaving(false);
    setEditingTeam(null);
    router.refresh();
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newTeamCode.trim()) {
      setCreateError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setSaving(true);
    setCreateError("");
    const result = await createTeam({ name: newTeamName.trim(), code: newTeamCode.trim() });
    if (result.error) {
      setCreateError(result.error);
      setSaving(false);
    } else {
      setSaving(false);
      setShowCreateModal(false);
      setNewTeamName("");
      setNewTeamCode("");
      router.refresh();
    }
  };

  const handleManageMembers = async (team: Team) => {
    setManagingMembersTeam(team);
    setLoadingMembers(true);
    const members = await getTeamMembers(team.id);
    setTeamMembers(members);
    setLoadingMembers(false);
  };

  const handleCloseMembersModal = () => {
    setManagingMembersTeam(null);
    setTeamMembers([]);
    router.refresh();
  };

  const refreshTeamMembers = async () => {
    if (!managingMembersTeam) return;
    const members = await getTeamMembers(managingMembersTeam.id);
    setTeamMembers(members);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-accent-orange rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">จัดการทีมทั้งหมด</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              สร้างทีม
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-blue-light rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{teams.length}</p>
                <p className="text-sm text-gray-500">ทีมทั้งหมด</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-teal-light rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {teams.reduce((acc, t) => acc + t._count.members, 0)}
                </p>
                <p className="text-sm text-gray-500">สมาชิกทั้งหมด</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent-purple-light rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {teams.reduce((acc, t) => acc + t._count.events, 0)}
                </p>
                <p className="text-sm text-gray-500">กิจกรรมทั้งหมด</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ค้นหาทีม... (ชื่อหรือรหัส)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-linear-to-r from-accent-blue-light/50 to-accent-purple-light/50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">
              รายการทีม ({filteredTeams.length})
            </h2>
          </div>

          {filteredTeams.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              {searchQuery ? "ไม่พบทีมที่ค้นหา" : "ยังไม่มีทีม"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {team.name}
                        </h3>
                        <button
                          onClick={() => handleCopyCode(team.code)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium transition-all",
                            copiedCode === team.code
                              ? "bg-accent-green-light text-accent-green"
                              : "bg-accent-blue-light text-accent-blue hover:bg-accent-blue/20"
                          )}
                        >
                          {copiedCode === team.code ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              {team.code}
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {team._count.members} สมาชิก
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {team._count.events} กิจกรรม
                        </span>
                        <span>สร้างเมื่อ {formatDate(team.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(team.code)}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          copiedCode === `link-${team.code}`
                            ? "text-accent-green bg-accent-green-light"
                            : "text-gray-400 hover:text-accent-blue hover:bg-accent-blue-light"
                        )}
                        title="Copy Link"
                      >
                        {copiedCode === `link-${team.code}` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-2 text-gray-400 hover:text-accent-purple hover:bg-accent-purple-light rounded-lg transition-all"
                        title="แก้ไขชื่อทีม"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleManageMembers(team)}
                        className="p-2 text-gray-400 hover:text-accent-teal hover:bg-accent-teal-light rounded-lg transition-all"
                        title="จัดการสมาชิก"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <Link href={`/team/${team.code}`} target="_blank">
                        <button
                          className="p-2 text-gray-400 hover:text-accent-blue hover:bg-accent-blue-light rounded-lg transition-all"
                          title="เปิดทีม"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(team)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all"
                        title="ลบทีม"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Team Modal */}
      <Modal
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        title="แก้ไขทีม"
      >
        {editingTeam && (
          <div className="space-y-4">
            <Input
              label="ชื่อทีม"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">รหัสทีม:</span>{" "}
                <span className="font-mono">{editingTeam.code}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setEditingTeam(null)}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSaveTeamName}
                disabled={saving || !editName.trim()}
                className="flex-1"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewTeamName("");
          setNewTeamCode("");
          setCreateError("");
        }}
        title="สร้างทีมใหม่"
      >
        <div className="space-y-4">
          {createError && (
            <div className="p-3 bg-primary-light text-primary rounded-lg text-sm">
              {createError}
            </div>
          )}
          <Input
            label="ชื่อทีม"
            placeholder="เช่น VEX IQ Team Alpha"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <div>
            <Input
              label="รหัสทีม"
              placeholder="เช่น VEXIQ01 หรือ 2025A"
              value={newTeamCode}
              onChange={(e) => setNewTeamCode(e.target.value.toUpperCase())}
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              4-10 ตัว ใช้ตัวเลขหรือตัวอักษรภาษาอังกฤษ
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                setNewTeamName("");
                setNewTeamCode("");
                setCreateError("");
              }}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={saving || !newTeamName.trim() || !newTeamCode.trim()}
              className="flex-1"
            >
              {saving ? "กำลังสร้าง..." : "สร้างทีม"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manage Members Modal */}
      <Modal
        isOpen={!!managingMembersTeam}
        onClose={handleCloseMembersModal}
        title={`จัดการสมาชิก - ${managingMembersTeam?.name || ""}`}
      >
        {managingMembersTeam && (
          <div>
            {loadingMembers ? (
              <div className="py-8 text-center text-gray-500">
                กำลังโหลด...
              </div>
            ) : (
              <MemberList
                teamId={managingMembersTeam.id}
                members={teamMembers}
                onMembersChange={refreshTeamMembers}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
