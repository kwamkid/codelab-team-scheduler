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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Codelab Team Scheduler
          </h1>
          <p className="text-gray-600 mt-2">
            ระบบจัดการตารางเวลาการมาซ้อมของทีม
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <JoinTeamForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">หรือ</span>
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
