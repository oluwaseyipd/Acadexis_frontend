"use client";

import Link from "next/link";
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

// ─── Nav config ───────────────────────────────────────────────────────────────
const STUDENT_NAV_ITEMS = [
  {label: "Overview", href: "/dashboard/student", icon: LayoutDashboard},
  { label: "My Library", href: "/dashboard/student/library", icon: Library },
  { label: "Study Lab", href: "/dashboard/student/study-lab", icon: FlaskConical },
  { label: "Course Catalog", href: "/dashboard/student/manage-courses", icon: BookOpen },
  { label: "Quizzes", href: "/dashboard/student/quizzes", icon: ClipboardList },
  { label: "Bookmark", href: "/dashboard/student/bookmark", icon: Bookmark },
] as const; 


const LECTURER_NAV_ITEMS = [
  {label: "Overview", href: "/dashboard/lecturer", icon: LayoutDashboard},
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
  const pathname = usePathname();
  const isLecturer = pathname?.startsWith("/dashboard/lecturer");
  const navItems = isLecturer ? LECTURER_NAV_ITEMS : STUDENT_NAV_ITEMS;
  const profileHref = isLecturer ? "/dashboard/lecturer/profile" : "/dashboard/student/profile";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40  w-70 flex flex-col justify-between bg-sidebar py-6 px-4 shrink-0 font-sans transition-transform duration-300 shadow-xl md:relative md:translate-x-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* User identity */}
      <div className="mb-8 px-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-sidebar-foreground leading-tight">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{userSubtitle}</p>
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
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 group ${
                isActive
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
                className={`absolute right-0 w-1.5 h-full rounded-r-lg bg-brand-primary transition-opacity duration-150 ${
                  isActive ? "opacity-100" : "opacity-0"
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
          className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-primary text-white text-xs font-bold shrink-0"
        >
          JA
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-sidebar-foreground leading-tight">
            John Abiola
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">oluwaseyipd@gmail.com</p>
        </div>
        </Link>

      </div>
      {/* Bottom links */}
      <div className="mt-4 py-1 border-t border-border flex flex-col gap-0.5">
        <button
          onClick={() => {
            // Clear tokens and redirect
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
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
