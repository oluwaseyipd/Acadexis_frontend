"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

// ─── Props ────────────────────────────────────────────────────────────────────
interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export default function AdminDashboardLayout({
  children,
  userName = "Admin",
  userEmail = "admin@acadexis.com",
}: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f6f9]">
      {/* TopBar */}
      <AdminTopBar
        userName={userName}
        userInitials={getInitials(userName)}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main area */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          userName={userName}
          userEmail={userEmail}
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
    </div>
  );
}