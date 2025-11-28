import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTeamByCode } from "@/actions/team";
import MemberList from "@/components/team/MemberList";
import Button from "@/components/ui/Button";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function MembersPage({ params }: Props) {
  const { code } = await params;
  const team = await getTeamByCode(code);

  if (!team) {
    notFound();
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
            <h1 className="text-xl font-bold text-black">จัดการสมาชิก</h1>
            <p className="text-sm text-gray-500">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <MemberList teamId={team.id} members={team.members} />
        </div>
      </main>
    </div>
  );
}
