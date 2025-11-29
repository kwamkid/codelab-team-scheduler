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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // Validate team code: only A-Z, 0-9, length 4-10
    const cleanCode = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (cleanCode !== code.toUpperCase() || cleanCode.length < 4 || cleanCode.length > 10) {
      setError("รหัสทีมต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลข 4-10 ตัวเท่านั้น (ไม่มีเว้นวรรคหรืออักขระพิเศษ)");
      return;
    }

    setLoading(true);
    setError("");

    const result = await createTeam({ name, code: cleanCode });
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
        <div className="p-3 bg-primary-light text-primary rounded-lg text-sm">
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
          onChange={(e) => {
            const value = e.target.value;
            setCode(value);
            // Show error if invalid characters detected
            if (value && !/^[A-Za-z0-9]*$/.test(value)) {
              setError("รหัสทีมใช้ได้แค่ A-Z และ 0-9 เท่านั้น (ไม่มีเว้นวรรค ภาษาไทย หรืออักขระพิเศษ)");
            } else if (error.includes("รหัสทีม")) {
              setError("");
            }
          }}
          maxLength={15}
          autoComplete="off"
          error={code && !/^[A-Za-z0-9]*$/.test(code) ? "ใช้ได้แค่ A-Z และ 0-9" : undefined}
        />
        <p className="text-xs text-gray-500 mt-1">
          4-10 ตัว ใช้ตัวเลขหรือตัวอักษรภาษาอังกฤษเท่านั้น (ไม่มีเว้นวรรค)
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "กำลังสร้าง..." : "สร้างทีม"}
      </Button>
    </form>
  );
}
