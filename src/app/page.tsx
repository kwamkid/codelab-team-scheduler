"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import JoinTeamForm from "@/components/team/JoinTeamForm";
import CreateTeamForm from "@/components/team/CreateTeamForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">หรือ</span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setShowCreateModal(true)}
            className="w-full"
          >
            สร้างทีมใหม่
          </Button>
        </div>

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="สร้างทีมใหม่"
        >
          <CreateTeamForm />
        </Modal>
      </div>
    </main>
  );
}
