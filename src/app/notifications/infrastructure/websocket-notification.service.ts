// websocket-notification.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

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

  private stompClient: Stomp.Client | null = null;

  // Signal for connection state
  readonly connected = signal<boolean>(false);
  readonly notifications$ = new BehaviorSubject<Notification | null>(null);

  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  connect(): void {
    // If already connected, avoid reconnect
    if (this.stompClient?.connected) {
      this.connected.set(true);
      console.log('[WebSocket] Already connected ✅');
      return;
    }

    // Get token and strip quotes if present
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

    // Append token as query parameter (SockJS doesn't support custom headers)
    const wsEndpoint = `${environment.wsUrl}/ws-notifications?token=${encodeURIComponent(token)}`;

    console.log('[WebSocket] Connecting to:', wsEndpoint.replace(/token=[^&]+/, 'token=***'));

    try {
      const socket = new SockJS(wsEndpoint);
      this.stompClient = Stomp.over(socket);

      // Disable debug logging
      // @ts-ignore
      this.stompClient.debug = null;

      this.stompClient.connect(
        {},
        () => {
          this.connected.set(true);
          console.log('[WebSocket] Connected successfully ✅');

          if (this.stompClient) {
            this.stompClient.subscribe('/topic/notifications', (message) => {
              try {
                const notification = JSON.parse(message.body) as Notification;
                console.log('[WebSocket] Notification received:', notification);
                this.notifications$.next(notification);
              } catch (error) {
                console.error('[WebSocket] Failed to parse notification:', error);
              }
            });
          }
        },
        (error) => {
          this.connected.set(false);
          console.error('[WebSocket] Connection error ❌', error);
        }
      );
    } catch (error) {
      this.connected.set(false);
      console.error('[WebSocket] Failed to create connection:', error);
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        this.connected.set(false);
        this.stompClient = null;
        console.log('[WebSocket] Disconnected');
      });
    }
  }

  isConnected(): boolean {
    return this.connected();
  }

  // Send notification through websocket (expects server-side mapping)
  sendNotification(title: string, message: string): void {
    if (!this.stompClient?.connected) {
      console.error('[WebSocket] Not connected. Cannot send notification.');
      return;
    }

    const notification = { title, message };

    try {
      this.stompClient.send('/app/notify', {}, JSON.stringify(notification));
      console.log('[WebSocket] Notification sent:', notification);
    } catch (error) {
      console.error('[WebSocket] Failed to send notification:', error);
    }
  }

  // Send via REST as backup
  sendNotificationViaRest(notification: Notification): Observable<unknown> {
    return this.http.post(`${this.baseUrl}`, notification);
  }
}
