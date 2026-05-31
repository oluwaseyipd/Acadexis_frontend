import { WsNotificationPayload, WsConnectionEstablished } from "@/types/notification";

type NotificationHandler = (notification: WsNotificationPayload) => void;
type ConnectionHandler = (unreadCount: number) => void;

export class NotificationManager {
  private ws: WebSocket | null = null;
  private token: string;
  private reconnectAttempts = 0;
  private readonly maxAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  public onNotification: NotificationHandler | null = null;
  public onConnected: ConnectionHandler | null = null;
  public onDisconnected: (() => void) | null = null;

  constructor(token: string) {
    this.token = token;
    this.connect();
  }

  private getWsUrl(): string {
    const base = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
    return `${base}/ws/notifications/?token=${this.token}`;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.getWsUrl());

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "connection_established") {
          const msg = data as WsConnectionEstablished;
          this.onConnected?.(msg.unread_count);
          return;
        }

        this.onNotification?.(data as WsNotificationPayload);
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onerror = () => {
      // onclose will handle reconnect
    };

    this.ws.onclose = () => {
      this.onDisconnected?.();
      if (!this.intentionalClose) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxAttempts) return;

    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
  }

  send(payload: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  markRead(notificationId: string): void {
    this.send({ action: "mark_read", notification_id: notificationId });
  }

  markAllRead(): void {
    this.send({ action: "mark_all_read" });
  }

  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
    this.ws = null;
  }

  updateToken(newToken: string): void {
    this.token = newToken;
    this.disconnect();
    this.intentionalClose = false;
    this.connect();
  }
}
