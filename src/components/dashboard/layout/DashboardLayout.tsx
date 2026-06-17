"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
// import Askai from "./Askai";
import { useNotifications } from "@/hooks/useNotifications";

// ─── Props ────────────────────────────────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode;

  // User info — typically sourced from your auth context / session
  userName?: string;
  userSubtitle?: string;
  userInitials?: string;
  avatarColor?: string;
  /** Passed down to AskAI to set context-aware placeholder & welcome message */
  courseContext?: string;
}

export default function DashboardLayout({
  children,
  userName = "Athenaeum Portal",
  userSubtitle = "Undergraduate Studies",
  userInitials = "S",
  avatarColor = "bg-orange-400",
  courseContext,
}: DashboardLayoutProps) {
  useNotifications();
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f6f9]">
      {/* TopBar */}
      <TopBar
        userName={userName}
        userInitials={userInitials}
        avatarColor={avatarColor}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* ── Main area ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <Sidebar
          userName={userName}
          userSubtitle={userSubtitle}
          onAITutorClick={() => setAiOpen(true)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {children}
        </main>
      </div>

      {/* ── Floating AI ───────────────────────────────────────────────────── */}
      {/* <Askai
        courseContext={courseContext}
        isOpen={aiOpen}
        onOpenChange={setAiOpen}
      /> */}
    </div>
  );
}