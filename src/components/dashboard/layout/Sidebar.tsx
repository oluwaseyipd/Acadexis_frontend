"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Library,
  FlaskConical,
  ClipboardList,
  Bookmark,
  LogOut,
  LayoutDashboard,
  X,
  Upload,
  Users,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ─── Nav config ───────────────────────────────────────────────────────────────
const STUDENT_NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Library", href: "/dashboard/student/library", icon: Library },
  { label: "Study Lab", href: "/dashboard/student/study-lab", icon: FlaskConical },
  { label: "Course Catalog", href: "/dashboard/student/manage-courses", icon: BookOpen },
  { label: "Quizzes", href: "/dashboard/student/quizzes", icon: ClipboardList },
  { label: "Bookmark", href: "/dashboard/student/bookmark", icon: Bookmark },
] as const;


const LECTURER_NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/lecturer", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/lecturer/my-courses", icon: BookOpen },
  { label: "Uploads", href: "/dashboard/lecturer/knowledge-hub", icon: Upload },
  { label: "Manage Students", href: "/dashboard/lecturer/manage-students", icon: Users },
] as const;


// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  userName?: string;
  userSubtitle?: string;
  onAITutorClick?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  userName = "Athenaeum Portal",
  userSubtitle = "Undergraduate Studies",
  isOpen = false,
  onClose,
}: SidebarProps) {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const isLecturer = pathname?.startsWith("/dashboard/lecturer");
  const navItems = isLecturer ? LECTURER_NAV_ITEMS : STUDENT_NAV_ITEMS;
  const profileHref = isLecturer ? "/dashboard/lecturer/profile" : "/dashboard/student/profile";

  const displayName = user?.name ?? userName;
  const displaySubtitle = user?.profile?.department ?? user?.profile?.level ?? userSubtitle;
  const displayEmail = user?.email ?? "";
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

    return displayName
      .split(" ")
      .filter(Boolean)
      .map((segment) => segment[0].toUpperCase())
      .slice(0, 2)
      .join("") || "U";
  }, [user, displayName]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40  w-70 flex flex-col justify-between bg-sidebar py-6 px-4 shrink-0 font-sans transition-transform duration-300 shadow-xl md:relative md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isDashboardRoot = href === "/dashboard/student" || href === "/dashboard/lecturer";
          const isActive =
            pathname === href ||
            (!isDashboardRoot && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 group ${isActive
                  ? "text-brand-primary bg-brand-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              <Icon
                size={17}
                strokeWidth={1.8}
                className={
                  isActive
                    ? "text-brand-primary font-bold"
                    : "text-muted-foreground group-hover:text-foreground"
                }
              />
              {label}

              {/* Active indicator bar */}
              <span
                className={`absolute right-0 w-1.5 h-full rounded-r-lg bg-brand-primary transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"
                  }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="py-3 border-t border-border bg-brand-primary/10 hover:bg-brand-primary/15 rounded-lg transition-all duration-150">
        <Link
          href={profileHref}
          className="flex items-center gap-3 px-3 rounded-lg transition-colors"
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${displayAvatarUrl ? "overflow-hidden bg-transparent" : "bg-brand-primary"}`}
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
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-sidebar-foreground leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayEmail || displaySubtitle}
            </p>
          </div>
        </Link>

      </div>
      {/* Bottom links */}
      <div className="mt-4 py-1 border-t border-border flex flex-col gap-0.5">
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
          className="flex items-center gap-2.5 px-3 py-4 text-xs text-muted-foreground hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors w-full text-left"
        >
          <LogOut size={14} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}
