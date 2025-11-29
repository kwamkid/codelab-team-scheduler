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
        <div className="p-3 bg-primary-light text-primary rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="รหัสทีม"
        placeholder="เช่น VEXIQ01"
        value={code}
        onChange={(e) => {
          // Filter and uppercase immediately - handles all input including paste, IME, etc.
          const filtered = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
          setCode(filtered);
        }}
        onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
          const event = e.nativeEvent as InputEvent;
          // Block non-alphanumeric characters before they're inserted
          if (event.data && !/^[A-Za-z0-9]+$/.test(event.data)) {
            e.preventDefault();
          }
        }}
        maxLength={10}
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="characters"
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "กำลังค้นหา..." : "เข้าทีม"}
      </Button>
    </form>
  );
}
