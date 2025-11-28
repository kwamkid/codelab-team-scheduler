import { Bot } from "lucide-react";
import JoinTeamForm from "@/components/team/JoinTeamForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-accent-blue-light/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent-orange rounded-2xl mb-4 shadow-lg shadow-primary/20">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Codelab Team Scheduler
          </h1>
          <p className="text-gray-500 mt-2">
            ระบบจัดการตารางเวลาการมาซ้อมของทีม
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
          <JoinTeamForm />
        </div>
      </div>
    </main>
  );
}
