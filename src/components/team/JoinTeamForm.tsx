"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTeamByCode } from "@/actions/team";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function JoinTeamForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    const team = await getTeamByCode(code);
    if (team) {
      router.push(`/team/${team.code}`);
    } else {
      setError("ไม่พบทีม กรุณาตรวจสอบรหัสทีม");
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
        label="รหัสทีม"
        placeholder="เช่น VEXIQ01"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        maxLength={10}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "กำลังค้นหา..." : "เข้าทีม"}
      </Button>
    </form>
  );
}
