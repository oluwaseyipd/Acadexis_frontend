"use client";

import { useState } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import apiService from "@/services/apiService";
import { Notification } from "@/types/notification";
import { UI_TEXT } from "@/lib/constants";

const NOTIFICATION_ICONS: Record<string, string> = {
  material_ready: "📄",
  new_enrollment: "🎓",
  course_announcement: "📢",
  admin_request_approved: "✅",
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  course: "📚",
};

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    markAllRead();
    try {
      await apiService.notifications.markAllNotificationsRead();
    } catch {
      // Best effort, local state remains optimistic
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleItemClick = async (notification: Notification) => {
    if (!notification.read) {
      markRead(notification.id);
      try {
        await apiService.notifications.markNotificationRead(notification.id);
      } catch {
        // Best effort; server sync will happen on next fetch
      }
    }
    handleNotificationNavigation(notification);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-card rounded-2xl shadow-[0_24px_80px_rgba(15,23,42,0.08)] border border-border z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
        <div>
          <p className="text-sm font-semibold text-foreground">{UI_TEXT.notifications.title}</p>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="text-xs font-medium text-brand-primary disabled:opacity-50"
          >
            {UI_TEXT.notifications.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {UI_TEXT.notifications.noNotifications}
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleItemClick(notification)}
              className={`w-full text-left flex gap-3 px-4 py-4 border-b border-border transition-colors ${
                !notification.read ? "bg-card" : "bg-background"
              } hover:bg-muted`}
            >
              <span className="text-lg mt-1 shrink-0">
                {NOTIFICATION_ICONS[notification.notificationType ?? notification.notification_type ?? ""] ?? "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-foreground`}>
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">{notification.body}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {formatTimeAgo(notification.createdAt ?? notification.created_at ?? "")}
                </p>
              </div>
              {!notification.read && (
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function handleNotificationNavigation(notification: Notification) {
  const { data } = notification;
  const type = notification.notificationType ?? notification.notification_type;
  const courseId = data?.courseId ?? data?.course_id;

  if (type === "material_ready" && courseId) {
    window.location.href = `/dashboard/lecturer/knowledge-hub?courseId=${courseId}`;
    return;
  }

  if (type === "new_enrollment" && courseId) {
    window.location.href = `/dashboard/lecturer?courseId=${courseId}`;
    return;
  }

  if (type === "course" && courseId) {
    window.location.href = `/dashboard/student/library/${courseId}`;
    return;
  }
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
