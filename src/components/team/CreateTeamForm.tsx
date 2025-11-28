"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeam } from "@/actions/team";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreateTeamForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !adminCode.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);
    setError("");

    const result = await createTeam({ name, code, adminCode });
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.team) {
      router.push(`/team/${result.team.code}`);
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
        label="ชื่อทีม"
        placeholder="เช่น VEX IQ Team Alpha"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <Input
          label="รหัสทีม"
          placeholder="เช่น VEXIQ01 หรือ 2025A"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          4-10 ตัว ใช้ตัวเลขหรือตัวอักษรภาษาอังกฤษ
        </p>
      </div>

      <div>
        <Input
          label="รหัส Admin"
          placeholder="สำหรับจัดการทีม"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          maxLength={10}
        />
        <p className="text-xs text-gray-500 mt-1">
          4-10 ตัว สำหรับใช้จัดการทีม (แก้ไข/ลบ)
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "กำลังสร้าง..." : "สร้างทีม"}
      </Button>
    </form>
  );
}
