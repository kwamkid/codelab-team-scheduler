"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { Team } from "@/types";

interface TeamHeaderProps {
  team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <header className="bg-primary sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{team.name}</h1>
          <p className="text-sm text-white/70">รหัสทีม: {team.code}</p>
        </div>
        <Link
          href={`/team/${team.code}/members`}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Users className="w-4 h-4" />
          สมาชิก
        </Link>
      </div>
    </header>
  );
}
