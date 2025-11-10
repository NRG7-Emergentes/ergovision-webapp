import {Component, inject, signal, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {MonitorCamComponent} from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';
import {FormsModule} from '@angular/forms';
import {ZardSliderComponent} from '@shared/components/slider/slider.component';
import {Router} from '@angular/router';
import { WebsocketNotificationService } from '@app/notifications/infrastructure/websocket-notification.service';
import { toast } from 'ngx-sonner';

type MonitoringState = 'ACTIVE' | 'PAUSED' | 'FINALIZED';

@Component({
  selector: 'app-monitoring-active',
  imports: [
    MonitorCamComponent,
    ZardButtonComponent,
    ZardSwitchComponent,
    FormsModule,
    ZardSliderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="col-span-2 overflow-hidden rounded-lg border ">
          <div class="w-full h-auto object-cover block">
            <app-monitor-cam/>
          </div>
        </div>
        <div class="col-span-1 space-y-4">
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full ">

            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Pauses</h2>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="text-md"> Next Pause in: </span>
                <span class="text-md text-muted-foreground"> 00:09:48 </span>
              </div>
              @if (currentState() === 'ACTIVE') {
                <button z-button (click)="onPause()">
                  <i class="icon-pause"></i>
                  Pause
                </button>
              } @else if (currentState() === 'PAUSED') {
                <button z-button (click)="onResume()">
                  <i class="icon-play"></i>
                  Resume
                </button>
              }
            </div>
          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full ">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Alerts</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center justify-between ">
                <p class="text-sm font-semibold text-foreground">Visual Alerts</p>
                <z-switch (checkChange)="visualAlerts.set($event)" [ngModel]="visualAlerts()"/>
              </div>

              <div class="flex items-center justify-between ">
                <p class="text-sm font-semibold text-foreground">Sound Alerts</p>
                <z-switch (checkChange)="soundAlerts.set($event)" [ngModel]="soundAlerts()"/>
              </div>
            </div>

          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Posture Status</h2>
            <div class="space-y-2 mb-4">
              <label class="text-sm font-semibold text-foreground">Nose Offset Sensitivity</label>

              <div class="flex items-center gap-3">
                <z-slider class="w-full" [zMin]="0" [zMax]="100" [zStep]="1" [zValue]="noseOffsetSensitivity()"
                          [zDefault]="noseOffsetSensitivity()" (onSlide)="noseOffsetSensitivity.set($event)"/>
                <span class="text-sm text-muted-foreground min-w-10"> {{ noseOffsetSensitivity() }} % </span>
                <button z-button zType="secondary" class="border">
                  Use Current
                </button>
              </div>




            </div>
            <div class="p-4 bg-secondary rounded-lg ">
              <p class="text-2xl font-bold mb-2">
                @if (currentState() === 'PAUSED') {
                  Monitoring Paused
                } @else {
                  You're sitting well
                }
              </p>
              <div class="text-muted-foreground">
                <span> Nose Offset:  </span>
                <span> {{ noseOffset() }}% </span>
              </div>
            </div>
          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Time </h2>

            <div class="flex justify-between items-center">
              <span class="text-md"> Monitoring time: </span>
              <span class="text-md text-muted-foreground"> 01:30:48 </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-md"> Bad posture time: </span>
              <span class="text-md text-muted-foreground"> 00:01:48 </span>
            </div>


          </div>
        </div>


      </div>
      <button z-button zType="destructive" zSize="lg" (click)="onFinishSession()">
        <i class="icon-square  "></i>
        Finish Session
      </button>
    </div>
  `,
  styles: ``,
})
export class MonitoringActiveComponent implements OnInit, OnDestroy {
  protected readonly visualAlerts = signal(true);
  protected readonly soundAlerts = signal(true);
  protected readonly alertInterval = signal("10");
  protected readonly pauseInterval = signal("10");
  protected readonly noseOffsetSensitivity = signal(43);
  protected readonly noseOffset = signal(24.5);

  // 🔹 Estado actual del monitoreo
  protected readonly currentState = signal<MonitoringState>('ACTIVE');

  private readonly router = inject(Router);
  private readonly wsService = inject(WebsocketNotificationService);

  ngOnInit(): void {
    this.wsService.connect();

    // 🔹 Escuchamos notificaciones del backend
    this.wsService.notifications$.subscribe(notification => {
      if (!notification) return;
      toast.info(`[${notification.type}] ${notification.title}`, { description: notification.message });
    });

    // 🔹 Al iniciar el monitoreo, mandamos la notificación
    this.sendStateNotification('ACTIVE');
  }

  ngOnDestroy(): void {
    if (this.currentState() !== 'FINALIZED') {
      this.sendStateNotification('FINALIZED');
    }
  }

  // 🔹 Pausa el monitoreo
  onPause(): void {
    this.currentState.set('PAUSED');
    this.sendStateNotification('PAUSED');
  }

  // 🔹 Resume el monitoreo
  onResume(): void {
    this.currentState.set('ACTIVE');
    this.sendStateNotification('ACTIVE');
  }

  // 🔹 Finaliza sesión
  onFinishSession(): void {
    this.currentState.set('FINALIZED');
    this.sendStateNotification('FINALIZED');

    // 🔹 Mostrar toast de finalización
    toast.success('Monitoring session has ended', {
      description: 'Your session data has been saved'
    });

    // Pequeño delay antes de navegar
    setTimeout(() => {
      this.router.navigate(['/history']);
    }, 1000);
  }

  private sendStateNotification(state: MonitoringState): void {
    const notification = {
      userId: 1,
      title: `Monitoring ${state}`,
      message:
        state === 'ACTIVE'
          ? 'Monitoring session is active'
          : state === 'PAUSED'
          ? 'Monitoring has been paused'
          : 'Monitoring session has ended',
      type: state,
      channel: 'web',
      preferredChannels: ['web'],
      doNotDisturb: false
    };

    // 🔹 Enviamos vía WebSocket directamente
    const wsTitle = `Monitoring ${state}`;
    const wsMessage = notification.message;
    this.wsService.sendNotification(wsTitle, wsMessage);

    // 🔹 También enviamos vía REST como respaldo
    this.wsService.sendNotificationViaRest(notification).subscribe({
      next: () => {
        console.log(`[Notification] ${state} sent`);

        // 🔹 Mostrar toast según el estado
        if (state === 'ACTIVE') {
          toast.success('✅ Monitoring Active', {
            description: 'Your posture is being monitored'
          });
        } else if (state === 'PAUSED') {
          toast.warning('⏸️ Monitoring Paused', {
            description: 'Click Resume to continue monitoring'
          });
        }
      },
      error: err => {
        console.error('[Notification Error]', err);
        toast.error('Failed to update monitoring state');
      }
    });
  }
}
