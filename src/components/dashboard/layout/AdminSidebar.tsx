"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare,
  AlertTriangle,
  UserPlus,
  LogOut,
  X,
  Settings,
  GraduationCap,
  Mail,
} from "lucide-react";

// ─── Admin Navigation Items ─────────────────────────────────────────────────
const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
] as const;

const SUPPORT_NAV_ITEMS = [
  { label: "Contact Messages", href: "/dashboard/admin/support/contacts", icon: Mail },
  { label: "Issue Reports", href: "/dashboard/admin/support/reports", icon: AlertTriangle },
  { label: "Admin Requests", href: "/dashboard/admin/support/requests", icon: UserPlus },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────
interface AdminSidebarProps {
  userName?: string;
  userEmail?: string;
  onAITutorClick?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  userName = "Admin",
  userEmail = "admin@acadexis.com",
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const isDashboardRoot = href === "/dashboard/admin";
    return pathname === href || (!isDashboardRoot && pathname.startsWith(href));
  };

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
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col justify-between bg-sidebar py-6 px-4 shrink-0 font-sans transition-transform duration-300 shadow-xl md:relative md:translate-x-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="mb-8 px-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground leading-tight">
              Acadexis
            </p>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1">
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main
          </span>
        </div>
        {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 group ${
              isActive(href)
                ? "text-brand-primary bg-brand-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon
              size={18}
              strokeWidth={1.8}
              className={
                isActive(href)
                  ? "text-brand-primary font-bold"
                  : "text-muted-foreground group-hover:text-foreground"
              }
            />
            {label}
            <span
              className={`absolute right-0 w-1.5 h-full rounded-r-lg bg-brand-primary transition-opacity duration-150 ${
                isActive(href) ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          </Link>
        ))}

        <div className="px-3 mt-6 mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Support Queue
          </span>
        </div>
        {SUPPORT_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 group ${
              isActive(href)
                ? "text-brand-primary bg-brand-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon
              size={18}
              strokeWidth={1.8}
              className={
                isActive(href)
                  ? "text-brand-primary font-bold"
                  : "text-muted-foreground group-hover:text-foreground"
              }
            />
            {label}
            <span
              className={`absolute right-0 w-1.5 h-full rounded-r-lg bg-brand-primary transition-opacity duration-150 ${
                isActive(href) ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="py-3 border-t border-border bg-brand-primary/10 hover:bg-brand-primary/15 rounded-lg transition-all duration-150">
        <Link
          href="/dashboard/admin/profile"
          className="flex items-center gap-3 px-3 rounded-lg transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(userName)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground leading-tight truncate">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </Link>
      </div>

      {/* Bottom links */}
      <div className="mt-4 py-1 border-t border-border flex flex-col gap-0.5">
        <Link
          href="/dashboard/admin/settings"
          className="flex items-center gap-2.5 px-3 py-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-muted transition-colors w-full"
        >
          <Settings size={14} strokeWidth={1.8} />
          Settings
        </Link>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
              document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
              window.location.href = "/auth/login";
            }
          }}
          className="flex items-center gap-2.5 px-3 py-3 text-xs text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut size={14} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}