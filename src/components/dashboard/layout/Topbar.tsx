"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, Bell, HelpCircle, X, Menu } from "lucide-react";
import Link from "next/link";
import NotificationPanel from "./NotificationPanel";
import { useNotificationStore } from "@/store/notificationStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ─── Props ────────────────────────────────────────────────────────────────────
interface TopBarProps {
  userName?: string;
  userInitials?: string;
  avatarColor?: string;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
}

export default function TopBar({
  userName = "Student",
  userInitials = "S",
  avatarColor = "bg-brand-primary",
  onSearch,
  onMenuClick,
}: TopBarProps) {
  const { user } = useCurrentUser();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? userName;
  const displayAvatarUrl = user?.profile?.avatarUrl;
  const displayInitials = useMemo(() => {
    if (user?.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .map((segment) => segment[0].toUpperCase())
        .slice(0, 2)
        .join("");
    }

    return userInitials;
  }, [user, userInitials]);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 py-8 bg-background border-b border-border gap-4">
      <div className="flex gap-24 items-center flex-1">
              {/* Brand */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

       <Link
        href="/dashboard/student"
        className="text-md font-bold text-foreground tracking-tight shrink-0 hover:text-brand-primary transition-colors"
      >
        The Academic Curator
      </Link>
      </div>
     

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className={`hidden md:flex items-center gap-2 flex-1 max-w-100 bg-muted rounded-full p-3 transition-all duration-200 ${
          isFocused ? "ring-2 ring-brand-primary/50 bg-card shadow-sm" : ""
        }`}
      >
        <Search size={14} strokeWidth={2} className="text-muted-foreground shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search study materials..."
          className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1 min-w-0"
          aria-label="Search study materials"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </form>

      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
        </div>

        {/* Help */}
        <Link
          href="/support"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={18} strokeWidth={1.8} />
        </Link>

        {/* Avatar */}
        <Link
          href="/dashboard/student/settings"
          className={`w-8 h-8 rounded-full overflow-hidden ${displayAvatarUrl ? "bg-transparent" : avatarColor} flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0`}
          aria-label={`${displayName}'s profile`}
          title={displayName}
        >
          {displayAvatarUrl ? (
            <Image
              src={displayAvatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{displayInitials}</span>
          )}
        </Link>
      </div> 
    </header>
  );
}