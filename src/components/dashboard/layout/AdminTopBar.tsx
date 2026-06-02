"use client";

import { useState } from "react";
import { Menu, Search, Bell, GraduationCap } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────
interface AdminTopBarProps {
  userName?: string;
  userInitials?: string;
  onMenuClick?: () => void;
}

export default function AdminTopBar({
  userName = "Admin",
  userInitials = "AD",
  onMenuClick,
}: AdminTopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop logo */}
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-foreground">Acadexis Admin</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className={`relative ${searchOpen ? "w-64" : "w-auto"} transition-all duration-200`}>
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users, courses..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User avatar (desktop only) */}
        <div className="hidden md:flex items-center gap-3 ml-2">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
}