"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Trash2 } from "lucide-react";
import { getTeamByCode, updateTeam, deleteTeam } from "@/actions/team";
import { Team } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function AdminPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminCode, setAdminCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdminCode, setDeleteAdminCode] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTeam = async () => {
      const teamData = await getTeamByCode(code);
      if (teamData) {
        setTeam(teamData);
        setName(teamData.name);
      }
      setLoading(false);
    };
    loadTeam();
  }, [code]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (team && adminCode === team.adminCode) {
      setIsVerified(true);
      setError("");
    } else {
      setError("รหัส Admin ไม่ถูกต้อง");
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !name.trim()) return;

    setSaving(true);
    const result = await updateTeam(team.id, { name: name.trim() }, adminCode);
    if (result.error) {
      setError(result.error);
    } else {
      setTeam({ ...team, name: name.trim() });
    }
    setSaving(false);
  };

  const handleCopyLink = async () => {
    if (!team) return;
    const link = `${window.location.origin}/team/${team.code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    setDeleting(true);
    const result = await deleteTeam(team.id, deleteAdminCode);
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">ไม่พบทีม</h1>
          <p className="text-gray-500">กรุณาตรวจสอบรหัสทีม</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              จัดการทีม
            </h1>
            <p className="text-gray-500 mb-6">{team.name}</p>

            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Input
                label="รหัส Admin"
                type="password"
                placeholder="ใส่รหัส Admin เพื่อเข้าจัดการ"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
              />
              <div className="flex gap-3">
                <Link href={`/team/${team.code}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    ย้อนกลับ
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  ยืนยัน
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/team/${team.code}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">จัดการทีม</h1>
            <p className="text-sm text-gray-500">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">ข้อมูลทีม</h2>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <Input
              label="ชื่อทีม"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Link สำหรับแชร์</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-gray-100 rounded-lg text-sm break-all">
              {typeof window !== "undefined"
                ? `${window.location.origin}/team/${team.code}`
                : `/team/${team.code}`}
            </code>
            <Button variant="secondary" onClick={handleCopyLink}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            รหัสทีม: <span className="font-mono font-medium">{team.code}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            ลบทีม
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            การลบทีมจะลบข้อมูลทั้งหมดรวมถึงสมาชิกและตารางทั้งหมด
            ไม่สามารถกู้คืนได้
          </p>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            ลบทีม
          </Button>
        </div>
      </main>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteAdminCode("");
          setError("");
        }}
        title="ยืนยันการลบทีม"
      >
        <form onSubmit={handleDelete} className="space-y-4">
          <p className="text-sm text-gray-600">
            กรุณายืนยันรหัส Admin เพื่อลบทีม &quot;{team.name}&quot;
          </p>
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Input
            label="รหัส Admin"
            type="password"
            value={deleteAdminCode}
            onChange={(e) => setDeleteAdminCode(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="danger" disabled={deleting} className="flex-1">
              {deleting ? "กำลังลบ..." : "ลบทีม"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
