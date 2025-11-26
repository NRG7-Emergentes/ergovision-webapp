// websocket-notification.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Notification {
  userId: number;
  title: string;
  message: string;
  type: string;
  channel: string;
  preferredChannels: string[];
  doNotDisturb: boolean;
}

@Injectable({ providedIn: 'root' })
export class WebsocketNotificationService {
  private readonly http = inject(HttpClient);

  private stompClient: Client | null = null;
  private currentUserId: number | null = null;

  readonly connected = signal<boolean>(false);
  readonly notifications$ = new BehaviorSubject<Notification | null>(null);

  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  connect(userId?: number): void {
    if (userId) {
      this.currentUserId = userId;
    } else {
      this.currentUserId = this.getUserIdFromToken();
    }

    if (this.stompClient?.connected) {
      this.connected.set(true);
      console.log('[WebSocket] Already connected ✅');
      return;
    }

    const rawToken = localStorage.getItem('token');
    if (!rawToken) {
      console.error('[WebSocket] No token found in localStorage');
      this.connected.set(false);
      return;
    }

    const token = rawToken.replace(/^["']|["']$/g, '').trim();
    if (!token) {
      console.error('[WebSocket] Token is empty after cleaning');
      this.connected.set(false);
      return;
    }

    const wsEndpoint = `${environment.wsUrl}/ws-notifications?token=${encodeURIComponent(token)}`;

    console.log('[WebSocket] Connecting to:', wsEndpoint.replace(/token=[^&]+/, 'token=***'));

    try {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(wsEndpoint),
        debug: () => {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        this.connected.set(true);
        console.log('[WebSocket] Connected successfully ✅');
        console.log(`[WebSocket] Filtering notifications for userId: ${this.currentUserId}`);

        this.stompClient?.subscribe('/topic/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body) as Notification;
            console.log('[WebSocket] Notification received:', notification);

            this.handleFilteredNotification(notification);
          } catch (error) {
            console.error('[WebSocket] Failed to parse notification:', error);
          }
        });
      };

      this.stompClient.onStompError = (frame) => {
        this.connected.set(false);
        console.error('[WebSocket] STOMP error ❌', frame);
      };

      this.stompClient.onWebSocketError = (event) => {
        this.connected.set(false);
        console.error('[WebSocket] WebSocket error ❌', event);
      };

      this.stompClient.activate();
    } catch (error) {
      this.connected.set(false);
      console.error('[WebSocket] Failed to create connection:', error);
    }
  }

  // ============================================================
  // 🔥 CORRECCIÓN: Filtrado seguro comparando NUMBERS
  // ============================================================
  private handleFilteredNotification(notification: Notification): void {
    if (!this.currentUserId) {
      console.warn('[WebSocket] No userId set for filtering. Showing all notifications.');
      this.notifications$.next(notification);
      return;
    }

    const notificationUserId = Number(notification.userId);
    const currentUserId = Number(this.currentUserId);

    if (notificationUserId === currentUserId) {
      console.log(`[WebSocket] Notification filtered for userId: ${this.currentUserId}`);
      this.notifications$.next(notification);
    } else {
      console.log(
        `[WebSocket] Notification filtered out - intended for userId: ${notification.userId}, current userId: ${this.currentUserId}`
      );
    }
  }

  private getUserIdFromToken(): number | null {
    try {
      const rawToken = localStorage.getItem('token');
      if (!rawToken) return null;

      const token = rawToken.replace(/^["']|["']$/g, '').trim();
      const parts = token.split('.');

      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.userId || payload.sub;
      return userId ? Number(userId) : null;
    } catch (error) {
      console.error('[WebSocket] Error extracting userId from token:', error);
      return null;
    }
  }

  setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
    console.log(`[WebSocket] UserId for filtering set to: ${userId}`);
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected.set(false);
      this.stompClient = null;
      this.currentUserId = null;
      console.log('[WebSocket] Disconnected');
    }
  }

  isConnected(): boolean {
    return this.connected();
  }

  // ============================================================
  // 🔥 CORRECCIÓN: Siempre enviar userId como NUMBER
  // ============================================================
  sendNotification(title: string, message: string, targetUserId?: number): void {
    if (!this.stompClient?.connected) {
      console.error('[WebSocket] Not connected. Cannot send notification.');
      return;
    }

    const notification = {
      title,
      message,
      userId: targetUserId ? Number(targetUserId) : Number(this.currentUserId)
    };

    try {
      this.stompClient.publish({
        destination: '/app/notify',
        body: JSON.stringify(notification),
      });
      console.log('[WebSocket] Notification sent:', notification);
    } catch (error) {
      console.error('[WebSocket] Failed to send notification:', error);
    }
  }

  sendNotificationViaRest(notification: Notification): Observable<unknown> {
    return this.http.post(`${this.baseUrl}`, notification);
  }
}
