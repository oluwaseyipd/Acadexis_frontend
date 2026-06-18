export type NotificationType =
  | "material_ready"
  | "new_enrollment"
  | "course_announcement"
  | "admin_request_approved"
  | "info"
  | "success"
  | "warning"
  | "course";

export interface Notification {
  id: string;
  user: string; // UUID
  title: string;
  body: string; // Primary key — use this in new code
  message: string; // Alias for body — present for compat
  notification_type?: NotificationType; // Primary key — use this in new code
  notificationType?: NotificationType; // camelCase fallback
  type?: NotificationType; // Alias for notification_type — present for compat
  read: boolean;
  data: Record<string, string>;
  created_at?: string;
  createdAt?: string;
}

export interface WsNotificationPayload {
  id: string;
  title: string;
  body: string;
  notification_type: NotificationType;
  read: boolean;
  created_at: string;
  data: Record<string, string>;
}

export interface WsConnectionEstablished {
  type: "connection_established";
  unread_count: number;
}
