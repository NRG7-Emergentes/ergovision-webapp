import { Component, OnInit, OnDestroy, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { MonitorCamComponent } from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { WebsocketNotificationService } from '@app/notifications/infrastructure/websocket-notification.service';

@Component({
  selector: 'monitoring-start',
  imports: [MonitorCamComponent, ZardButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="col-span-2 overflow-hidden rounded-lg border ">
          @if (cameraAvailable()) {
            <div class="w-full h-auto object-cover block">
              <app-monitor-cam />
            </div>
          }
          @else {
            <div class="bg-card border-border p-6 rounded-lg shadow-sm h-full flex flex-col">
              <div class="flex-1 flex items-center justify-center bg-secondary rounded-lg  relative overflow-hidden">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <i class="icon-video text-muted-foreground " style="font-size: 2rem;"></i>
                  </div>
                  <div class="text-center">
                    <p class="text-foreground font-semibold text-lg">Camera feed is off</p>
                    <p class="text-muted-foreground text-sm mt-1">Click "Give Permission" to continue</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        <div class="col-span-1">
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Recommendations</h2>
            <div class="flex flex-col gap-4">
              <div class="flex gap-4 p-4 bg-secondary rounded-lg hover:bg-muted transition-colors duration-200">
                <div class="flex items-center gap-4">
                  <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10 " >
                    <div class="aspect-square w-5 h-5 flex justify-center items-center">
                      <i class="icon-info text-primary "></i>
                    </div>
                  </div>
                  <div>
                    <span class="text-lg font-semibold text-foreground">Adjust Your Chair</span>
                    <p class="text-sm text-muted-foreground">
                      Ensure your feet are flat on the floor and your knees are at a 90-degree angle.
                    </p>
                  </div>
                </div>

              </div>

              <div class="flex gap-4 p-4 bg-secondary rounded-lg hover:bg-muted transition-colors duration-200">
                <div class="flex items-center gap-4">
                  <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10 " >
                    <div class="aspect-square w-5 h-5 flex justify-center items-center">
                      <i class="icon-monitor text-primary "></i>
                    </div>
                  </div>
                  <div>
                    <span class="text-lg font-semibold text-foreground">Monitor Height</span>
                    <p class="text-sm text-muted-foreground">
                      The top of your screen should be at or slightly below eye level.
                    </p>
                  </div>
                </div>

              </div>

              <div class="flex gap-4 p-4 bg-secondary rounded-lg hover:bg-muted transition-colors duration-200">
                <div class="flex items-center gap-4">
                  <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10 " >
                    <div class="aspect-square w-5 h-5 flex justify-center items-center">
                      <i class="icon-clock text-primary "></i>
                    </div>
                  </div>
                  <div>
                    <span class="text-lg font-semibold text-foreground">Take Regular Breaks</span>
                    <p class="text-sm text-muted-foreground">
                      Stand up and stretch every 30 minutes to improve circulation.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>


      </div>
      <div class="flex gap-4 ">
        <button z-button zType="outline" zSize="lg" (click)="goToCalibration()"> Calibrate </button>
        <button z-button zSize="lg" (click)="goToActiveMonitoring()"> Start </button>
      </div>
    </div>
  `,
  styles: []
})
export class MonitoringStartComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly wsService = inject(WebsocketNotificationService);

  readonly cameraAvailable = signal(false);

  private lastNotificationTime = 0;
  private readonly NOTIFICATION_THROTTLE_MS = 3000;
  private shownNotifications = new Set<string>();

  constructor() {
    // Effect to listen to WebSocket notifications (eliminar duplicados)
    effect(() => {
      const subscription = this.wsService.notifications$.subscribe(notification => {
        if (!notification) return;

        // Evitar notificaciones duplicadas
        const notificationKey = `${notification.title}-${notification.message}`;
        if (this.shownNotifications.has(notificationKey)) {
          return;
        }

        // Throttle notifications
        const now = Date.now();
        if (now - this.lastNotificationTime < this.NOTIFICATION_THROTTLE_MS) {
          return;
        }

        this.lastNotificationTime = now;
        this.shownNotifications.add(notificationKey);

        // Limpiar el set después de 5 segundos para permitir notificaciones repetidas
        setTimeout(() => {
          this.shownNotifications.delete(notificationKey);
        }, 5000);

        // Mostrar solo si es relevante para esta vista
        if (notification.type && !['ACTIVE', 'PAUSED', 'FINALIZED'].includes(notification.type)) {
          toast.info(notification.title, {
            description: notification.message,
            duration: 3000
          });
        }
      });

      return () => subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.checkCameraAvailability();
    this.initializeWebSocket();
  }

  ngOnDestroy(): void {
    // Limpiar notificaciones mostradas
    this.shownNotifications.clear();
  }

  async checkCameraAvailability(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.cameraAvailable.set(true);
    } catch {
      this.cameraAvailable.set(false);
    }
  }

  goToCalibration(): void {
    if (!this.wsService.connected()) {
      toast.error('Connection unavailable', {
        description: 'Please check your network connection',
        duration: 3000
      });
      return;
    }

    this.wsService.sendNotification('Calibration started', 'Preparing calibration system');
    this.router.navigate(['/calibration']);
  }

  goToActiveMonitoring(): void {
    if (!this.cameraAvailable()) {
      toast.error('Camera unavailable', {
        description: 'Please grant camera permissions to continue',
        duration: 3000
      });
      return;
    }

    this.wsService.sendNotification('Session started', 'Posture monitoring has begun');
    this.router.navigate(['/monitoring/active']);
  }

  private initializeWebSocket(): void {
    this.wsService.connect();

    // Solo mostrar notificación de conexión una vez
    setTimeout(() => {
      if (this.wsService.connected()) {
        toast.success('Connected', {
          description: 'Notification server is ready',
          duration: 2000
        });
      } else {
        toast.error('Connection failed', {
          description: 'Unable to connect to notification server',
          duration: 3000
        });
      }
    }, 1000);
  }
}
