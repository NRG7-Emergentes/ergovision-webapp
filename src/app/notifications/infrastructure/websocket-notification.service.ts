// websocket-notification.service.ts
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Injectable, signal } from '@angular/core';
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
  private stompClient: any;

  // 🔹 Signal para el estado de conexión
  readonly connected = signal<boolean>(false);

  public isConnected$ = new BehaviorSubject<boolean>(false);
  public notifications$ = new BehaviorSubject<Notification | null>(null);

  // ✅ Ya no duplicamos `/api/v1`
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  connect(): void {
    // 🔹 Si ya está conectado, no reconectar
    if (this.stompClient?.connected) {
      this.connected.set(true);
      this.isConnected$.next(true);
      console.log('[WebSocket] Ya conectado ✅');
      return;
    }

    // ✅ usamos el nuevo wsUrl
    const socket = new SockJS(`${environment.wsUrl}/ws-notifications`);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      () => {
        this.connected.set(true);
        this.isConnected$.next(true);
        console.log('[WebSocket] Conectado al servidor ✅');

        this.stompClient.subscribe('/topic/notifications', (message: any) => {
          const notification = JSON.parse(message.body);
          console.log('[WebSocket] Notificación recibida:', notification);
          this.notifications$.next(notification);
        });
      },
      (error: any) => {
        this.connected.set(false);
        this.isConnected$.next(false);
        console.error('[WebSocket] Error de conexión ❌', error);
      }
    );
  }

  disconnect(): void {
    this.stompClient?.disconnect(() => {
      this.connected.set(false);
      this.isConnected$.next(false);
      console.log('[WebSocket] Desconectado');
    });
  }

  isConnected(): boolean {
    return this.connected();
  }

  // 🔹 Enviar notificación directamente vía WebSocket
  sendNotification(title: string, message: string): void {
    if (!this.stompClient?.connected) {
      console.error('[WebSocket] No conectado. No se puede enviar notificación.');
      return;
    }

    const notification = { title, message };

    this.stompClient.send('/app/notify', {}, JSON.stringify(notification));

    console.log('[WebSocket] Notificación enviada:', notification);
  }

  // 🔹 Envío REST
  sendNotificationViaRest(notification: Notification): Observable<unknown> {
    return this.http.post(`${this.baseUrl}`, notification);
  }
}
