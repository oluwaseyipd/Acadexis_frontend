"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useNotificationStore } from "@/store/notificationStore";
import { NotificationManager } from "@/services/NotificationManager";
import apiService from "@/services/apiService";
import {
  Notification,
  WsNotificationPayload,
} from "@/types/notification";
import { tokenStorage } from "@/services/api-client";

export const useNotifications = () => {
  const { user } = useAppStore();
  const {
    notifications,
    unreadCount,
    setNotifications,
    prependNotification,
    markRead,
    markAllRead,
    setUnreadCount,
  } = useNotificationStore();
  const managerRef = useRef<NotificationManager | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiService.notifications.getNotifications({ page: 1 });
      setNotifications(data.data.results);
    } catch {
      // Non-critical — WebSocket keeps state fresh
    }
  }, [setNotifications]);

  const handleMarkRead = useCallback(
    async (id: string) => {
      markRead(id);
      try {
        await apiService.notifications.markNotificationRead(id);
      } catch {
        await fetchNotifications();
      }
    },
    [markRead, fetchNotifications]
  );

  const handleMarkAllRead = useCallback(async () => {
    markAllRead();
    try {
      await apiService.notifications.markAllNotificationsRead();
    } catch {
      await fetchNotifications();
    }
  }, [markAllRead, fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    const token = tokenStorage.getToken();
    if (!token) return;

    fetchNotifications();

    const manager = new NotificationManager(token);

    manager.onConnected = (count) => {
      setUnreadCount(count);
    };

    manager.onNotification = (payload: WsNotificationPayload) => {
      const notification: Notification = {
        id: payload.id,
        user: user.id,
        title: payload.title,
        body: payload.body,
        message: payload.body,
        notification_type: payload.notification_type,
        type: payload.notification_type,
        read: payload.read,
        data: payload.data ?? {},
        created_at: payload.created_at,
      };
      prependNotification(notification);
    };

    managerRef.current = manager;

    return () => {
      manager.disconnect();
      managerRef.current = null;
    };
  }, [user, fetchNotifications, prependNotification, setUnreadCount]);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
  };
};
