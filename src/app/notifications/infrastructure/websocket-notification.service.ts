// websocket-notification.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {AuthenticationService} from '@app/iam/services/authentication.service';

interface Notification {
  userId: number;
  title: string;
  message: string;
  type?: string;
  channel?: string;
  preferredChannels?: string[];
  doNotDisturb?: boolean;
}

@Injectable({ providedIn: 'root' })
export class WebsocketNotificationService {
  private readonly http = inject(HttpClient);

  private stompClient: Client | null = null;

  readonly connected = signal(false);
  readonly notifications$ = new BehaviorSubject<Notification | null>(null);

  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  connect(): void {
    if (this.stompClient?.connected) {
      this.connected.set(true);
      return;
    }

    const token = this.cleanToken(localStorage.getItem('token'));
    if (!token) {
      this.connected.set(false);
      return;
    }

    const endpoint = `${environment.wsUrl}/ws-notifications?token=${encodeURIComponent(token)}`;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(endpoint),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: () => {}
    });

    this.stompClient.onConnect = () => {
      this.connected.set(true);

      this.stompClient?.subscribe('/topic/notifications', (message) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          this.notifications$.next(notification);
        } catch {}
      });
    };

    this.stompClient.onStompError = () => this.connected.set(false);
    this.stompClient.onWebSocketError = () => this.connected.set(false);

    this.stompClient.activate();
  }

  private cleanToken(raw: string | null): string | null {
    if (!raw) return null;
    const token = raw.replace(/^["']|["']$/g, '').trim();
    return token.length > 0 ? token : null;
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.connected.set(false);
    this.stompClient = null;
  }

  isConnected(): boolean {
    return this.connected();
  }

  private readonly auth = inject(AuthenticationService);

  sendNotification(title: string, message: string): void {
    if (!this.stompClient?.connected) return;

    const userId = this.auth.getCurrentUserIdSync();
    if (!userId) return;

    this.stompClient.publish({
      destination: '/app/notify',
      body: JSON.stringify({ title, message, userId })
    });
  }




  sendNotificationViaRest(notification: Notification): Observable<unknown> {
    return this.http.post(this.baseUrl, notification);
  }
}
