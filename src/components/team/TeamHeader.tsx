"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { Team } from "@/types";
import Button from "@/components/ui/Button";

interface TeamHeaderProps {
  team: Team;
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-black">{team.name}</h1>
          <p className="text-sm text-gray-500">รหัสทีม: {team.code}</p>
        </div>
        <Link href={`/team/${team.code}/members`}>
          <Button variant="ghost" size="sm">
            <Users className="w-4 h-4 mr-2" />
            สมาชิก
          </Button>
        </Link>
      </div>
    </header>
  );
}
