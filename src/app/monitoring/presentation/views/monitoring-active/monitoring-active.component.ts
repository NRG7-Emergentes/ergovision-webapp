import { Component, inject, OnDestroy, OnInit, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { toast } from 'ngx-sonner';

import { MonitorCamComponent } from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import { ActivePauseDialogComponent } from '@app/monitoring/presentation/components/active-pause-dialog/active-pause-dialog.component';
import { WebsocketNotificationService } from '@app/notifications/infrastructure/websocket-notification.service';
import { MonitoringSessionService } from '@app/monitoring/presentation/services/monitoring-session.service';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardSwitchComponent } from '@shared/components/switch/switch.component';
import { ZardSliderComponent } from '@shared/components/slider/slider.component';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import {MonitoringSession} from '@app/monitoring/presentation/domain/model/monitoring-session';

type MonitoringState = 'ACTIVE' | 'PAUSED' | 'FINALIZED';

interface PostureLandmarks {
  readonly NOSE: 0;
  readonly LEFT_SHOULDER: 11;
  readonly RIGHT_SHOULDER: 12;
}

interface StateNotificationConfig {
  readonly title: string;
  readonly message: string;
  readonly toastType: 'success' | 'warning' | 'info';
  readonly toastDescription: string;
}

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
        <!-- Camera Feed -->
        <div class="col-span-2 overflow-hidden rounded-lg border">
          <div class="w-full h-auto object-cover block">
            <app-monitor-cam (postureResults)="handlePostureResults($event)" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-1 space-y-4">
          <!-- Pauses Card -->
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Pauses</h2>
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="text-md">Next Pause in:</span>
                <span class="text-md text-muted-foreground">{{ formattedNextPauseTime() }}</span>
              </div>
              <button z-button (click)="initPause()">
                <i class="icon-pause"></i> Pause
              </button>
            </div>
          </div>

          <!-- Alerts Card -->
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Alerts</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-foreground">Visual Alerts</p>
                <z-switch (checkChange)="visualAlerts.set($event)" [ngModel]="visualAlerts()" />
              </div>
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-foreground">Sound Alerts</p>
                <z-switch (checkChange)="soundAlerts.set($event)" [ngModel]="soundAlerts()" />
              </div>
            </div>
          </div>

          <!-- Posture Status Card -->
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Posture Status</h2>
            <div class="space-y-2 mb-4">
              <label class="text-sm font-semibold text-foreground">Nose Offset Sensitivity</label>
              <div class="flex items-center gap-4">
                <z-slider
                  class="w-full"
                  [zMin]="0"
                  [zMax]="100"
                  [zStep]="1"
                  [zValue]="noseOffsetSensitivity()"
                  [zDefault]="noseOffsetSensitivity()"
                  (onSlide)="noseOffsetSensitivity.set($event)" />
                <span class="text-sm text-muted-foreground min-w-10">{{ noseOffsetSensitivity() }}%</span>
              </div>
            </div>
            <div class="p-4 bg-secondary rounded-lg">
              @if (isBadPosture()) {
                <p class="text-2xl font-bold text-red-800">Bad Posture</p>
              } @else {
                <p class="text-2xl font-bold">You're sitting well</p>
              }
              <div class="text-muted-foreground text-md">
                <span>Nose Offset: </span>
                <span>{{ noseOffset().toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <!-- Time Card -->
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Time</h2>
            <div class="flex justify-between items-center">
              <span class="text-md">Monitoring time:</span>
              <span class="text-md text-muted-foreground">{{ formattedMonitoringTime() }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-md">Bad posture time:</span>
              <span class="text-md text-muted-foreground">{{ formattedBadPostureTime() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Finish Button -->
      <button z-button zType="destructive" zSize="lg" (click)="finishSession()">
        <i class="icon-square"></i> Finish Session
      </button>
    </div>
  `,
  styles: ``
})
export class MonitoringActiveComponent implements OnInit, OnDestroy {
  // Services
  private readonly router = inject(Router);
  private readonly dialogService = inject(ZardDialogService);
  private readonly wsService = inject(WebsocketNotificationService);
  private readonly monitoringSessionService = inject(MonitoringSessionService);

  // State signals
  readonly visualAlerts = signal(true);
  readonly soundAlerts = signal(true);
  readonly noseOffsetSensitivity = signal(90);
  readonly noseOffset = signal(0);
  readonly isBadPosture = signal(false);
  readonly monitoringTime = signal(0);
  readonly badPostureTime = signal(0);
  readonly nextPauseTime = signal(30);
  readonly isPaused = signal(false);
  readonly pauseTime = signal(0);
  readonly pausesTaken = signal(0);
  readonly totalPauseDuration = signal(0);
  readonly currentState = signal<MonitoringState>('ACTIVE');
  readonly wsConnected = signal(false);

  // Session tracking
  private sessionStartTime: Date = new Date();

  // Computed signals
  readonly formattedMonitoringTime = computed(() => this.formatTime(this.monitoringTime()));
  readonly formattedBadPostureTime = computed(() => this.formatTime(this.badPostureTime()));
  readonly formattedNextPauseTime = computed(() => this.formatTime(this.nextPauseTime()));

  // Constants
  private readonly POSE_LANDMARKS: PostureLandmarks = {
    NOSE: 0,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12
  } as const;

  private readonly THRESHOLDS = {
    BAD_POSTURE_ALERT: 10,
    NOSE_SHOULDER_DISTANCE: 0.15,
    CAMERA_DISTANCE: 42,
    AVERAGE_SHOULDER_WIDTH_CM: 40,
    FOCAL_LENGTH_FACTOR: 0.5
  } as const;

  private readonly STATE_NOTIFICATIONS: Record<MonitoringState, StateNotificationConfig> = {
    ACTIVE: {
      title: 'Monitoring ACTIVE',
      message: 'Monitoring session is active',
      toastType: 'success',
      toastDescription: 'Your posture is being monitored'
    },
    PAUSED: {
      title: 'Monitoring PAUSED',
      message: 'Monitoring has been paused',
      toastType: 'warning',
      toastDescription: 'Take a break and stretch'
    },
    FINALIZED: {
      title: 'Monitoring FINALIZED',
      message: 'Monitoring session has ended ',
      toastType: 'info',
      toastDescription: 'Your monitoring session has been saved'
    }
  } as const;

  // Timer references
  private monitoringIntervalId: number | undefined;
  private badPostureIntervalId: number | undefined;
  private pauseTimerIntervalId: number | undefined;
  private nextPauseIntervalId: number | undefined;

  // Bad posture tracking
  private badPostureStartTime: number | null = null;
  private lastAlertTime: number | null = null;

  // Audio
  private beepAudio: HTMLAudioElement | null = null;

  // Toast control
  private lastToastTime = 0;
  private readonly TOAST_THROTTLE_MS = 5000;
  private activeToastId: string | number | undefined;
  private shownNotifications = new Set<string>();

  constructor() {
    // Effect to sync WebSocket connection state
    effect(() => {
      this.wsConnected.set(this.wsService.connected());
    });

    // Effect to listen to WebSocket notifications (eliminar duplicados y throttle)
    effect(() => {
      const subscription = this.wsService.notifications$.subscribe(notification => {
        if (!notification) return;

        // Evitar notificaciones duplicadas
        const notificationKey = `${notification.type}-${notification.title}`;
        if (this.shownNotifications.has(notificationKey)) {
          return;
        }

        // Solo mostrar notificaciones relevantes para monitoreo activo
        if (!notification.type || !['ACTIVE', 'PAUSED', 'FINALIZED'].includes(notification.type)) {
          return;
        }

        // Throttle notifications
        const now = Date.now();
        if (now - this.lastToastTime < this.TOAST_THROTTLE_MS) {
          return;
        }

        this.lastToastTime = now;
        this.shownNotifications.add(notificationKey);

        // Limpiar después de 10 segundos
        setTimeout(() => {
          this.shownNotifications.delete(notificationKey);
        }, 10000);

        // Cerrar toast anterior si existe
        if (this.activeToastId) {
          toast.dismiss(this.activeToastId);
        }

        // No mostrar toast aquí, se mostrará en sendStateNotification
      });

      return () => subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.initializeWebSocket();
    this.initializeAudio();
    this.startTimers();
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.shownNotifications.clear();
  }

  // Public handlers
  handlePostureResults(results: PoseLandmarkerResult | null): void {
    if (this.isPaused() || !results?.landmarks?.length) {
      return;
    }

    const landmarks = results.landmarks[0];
    const nose = landmarks[this.POSE_LANDMARKS.NOSE];
    const leftShoulder = landmarks[this.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[this.POSE_LANDMARKS.RIGHT_SHOULDER];

    if (!nose || !leftShoulder || !rightShoulder) return;

    const postureMetrics = this.calculatePostureMetrics(nose, leftShoulder, rightShoulder);
    this.updatePostureState(postureMetrics);
  }

  initPause(): void {
    this.isPaused.set(true);
    this.currentState.set('PAUSED');
    this.sendStateNotification('PAUSED');
    this.pausesTaken.update(count => count + 1);
    this.pauseTime.set(0);

    this.pauseTimerIntervalId = window.setInterval(() => {
      this.pauseTime.update(time => time + 1);
    }, 1000);

    this.dialogService.create({
      zContent: ActivePauseDialogComponent,
      zData: {
        pauseTime: this.pauseTime,
        pausesTaken: this.pausesTaken
      },
      zOkText: 'Finish Pause',
      zCancelText: null,
      zOnOk: () => this.finishPause(),
      zWidth: '1280px',
      zClosable: false,
    });
  }

  finishSession(): void {
    this.currentState.set('FINALIZED');
    this.sendStateNotification('FINALIZED');

    const endDate = new Date();
    const duration = this.monitoringTime();
    const goodPostureTime = duration - this.badPostureTime();
    const averagePauseDuration = this.pausesTaken() > 0
      ? this.totalPauseDuration() / this.pausesTaken()
      : 0;

    // Calculate scores (0-100 scale)
    const goodPosturePercentage = duration > 0 ? (goodPostureTime / duration) * 100 : 0;
    const badPosturePercentage = duration > 0 ? (this.badPostureTime() / duration) * 100 : 0;
    const score = Math.round(goodPosturePercentage);

    const sessionData: Omit<MonitoringSession, 'id'> = {
      startDate: this.sessionStartTime,
      endDate: endDate,
      score: score,
      goodScore: Math.round(goodPosturePercentage),
      badScore: Math.round(badPosturePercentage),
      goodPostureTime: goodPostureTime,
      badPostureTime: this.badPostureTime(),
      duration: duration,
      numberOfPauses: this.pausesTaken(),
      averagePauseDuration: Math.round(averagePauseDuration)
    };

    // Create monitoring session
    this.monitoringSessionService.createMonitoringSession(sessionData).subscribe({
      next: (session) => {

        setTimeout(() => {
          this.router.navigate(['/history']);
        }, 1000);
      },
      error: (error) => {
        console.error('[MonitoringSession] Failed to create:', error);

        if (this.activeToastId) {
          toast.dismiss(this.activeToastId);
        }

        this.activeToastId = toast.error('Failed to save session', {
          description: 'Your session data could not be saved',
          duration: 4000
        });

        // Still navigate after error to prevent user from being stuck
        setTimeout(() => {
          this.router.navigate(['/history']);
        }, 2000);
      }
    });
  }

  // Private methods - Initialization
  private initializeWebSocket(): void {
    this.wsService.connect();

    setTimeout(() => {
      if (this.wsService.connected()) {
        console.log('[MonitoringActive] WebSocket connected');
        this.sendStateNotification('ACTIVE');
      } else {
        console.error('[MonitoringActive] WebSocket connection failed');

        // Cerrar toast anterior
        if (this.activeToastId) {
          toast.dismiss(this.activeToastId);
        }

        this.activeToastId = toast.error('Connection failed', {
          description: 'Unable to connect to notification server',
          duration: 3000
        });
      }
    }, 1000);
  }

  private initializeAudio(): void {
    this.beepAudio = new Audio('/assets/beep.opus');
    this.beepAudio.load();
  }

  private startTimers(): void {
    this.monitoringIntervalId = window.setInterval(() => {
      if (!this.isPaused()) {
        this.monitoringTime.update(time => time + 1);
      }
    }, 1000);

    this.nextPauseIntervalId = window.setInterval(() => {
      if (!this.isPaused()) {
        this.nextPauseTime.update(time => {
          const newTime = time - 1;
          if (newTime <= 0) {
            this.initPause();
            return 30;
          }
          return newTime;
        });
      }
    }, 1000);
  }

  // Private methods - Posture analysis
  private calculatePostureMetrics(
    nose: { x: number; y: number; z: number },
    leftShoulder: { x: number; y: number; z: number },
    rightShoulder: { x: number; y: number; z: number }
  ) {
    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2
    };

    const noseShoulderDistance = Math.abs(nose.y - shoulderMidpoint.y);
    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) +
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    );

    const cameraDistance = shoulderWidth > 0
      ? (this.THRESHOLDS.AVERAGE_SHOULDER_WIDTH_CM / shoulderWidth) * this.THRESHOLDS.FOCAL_LENGTH_FACTOR
      : 0;

    const noseOffsetPercentage = noseShoulderDistance * 100;
    const isNoseTooClose = noseShoulderDistance <
      (this.noseOffsetSensitivity() / 100) * this.THRESHOLDS.NOSE_SHOULDER_DISTANCE;
    const isTooCloseToCamera = cameraDistance > 0 && cameraDistance < this.THRESHOLDS.CAMERA_DISTANCE;

    return {
      noseOffsetPercentage,
      isBadPosture: isNoseTooClose || isTooCloseToCamera
    };
  }

  private updatePostureState(metrics: { noseOffsetPercentage: number; isBadPosture: boolean }): void {
    this.noseOffset.set(metrics.noseOffsetPercentage);
    this.isBadPosture.set(metrics.isBadPosture);

    if (metrics.isBadPosture) {
      this.handleBadPosture();
    } else {
      this.resetBadPostureTracking();
    }
  }

  private handleBadPosture(): void {
    if (this.badPostureStartTime === null) {
      this.badPostureStartTime = Date.now();
      this.lastAlertTime = null;
    }

    if (this.badPostureIntervalId === undefined) {
      this.badPostureIntervalId = window.setInterval(() => {
        this.badPostureTime.update(time => time + 1);
      }, 1000);
    }

    const badPostureDuration = (Date.now() - this.badPostureStartTime) / 1000;

    if (badPostureDuration >= this.THRESHOLDS.BAD_POSTURE_ALERT) {
      const timeSinceLastAlert = this.lastAlertTime
        ? (Date.now() - this.lastAlertTime) / 1000
        : badPostureDuration;

      if (timeSinceLastAlert >= this.THRESHOLDS.BAD_POSTURE_ALERT) {
        this.triggerBadPostureAlert();
        this.lastAlertTime = Date.now();
      }
    }
  }

  private resetBadPostureTracking(): void {
    this.badPostureStartTime = null;
    this.lastAlertTime = null;

    if (this.badPostureIntervalId !== undefined) {
      clearInterval(this.badPostureIntervalId);
      this.badPostureIntervalId = undefined;
    }
  }

  private triggerBadPostureAlert(): void {
    // Solo mostrar alerta si pasó suficiente tiempo desde la última
    const now = Date.now();
    if (now - this.lastToastTime < this.TOAST_THROTTLE_MS) {
      // Solo reproducir sonido sin toast
      if (this.soundAlerts() && this.beepAudio) {
        this.beepAudio.currentTime = 0;
        this.beepAudio.play().catch(err => {
          console.error('[Audio] Failed to play beep:', err);
        });
      }
      return;
    }

    this.lastToastTime = now;

    if (this.visualAlerts()) {
      // Cerrar toast anterior
      if (this.activeToastId) {
        toast.dismiss(this.activeToastId);
      }

      this.activeToastId = toast.error('Bad posture detected', {
        description: 'Please adjust your sitting position',
        duration: 4000
      });
    }

    if (this.soundAlerts() && this.beepAudio) {
      this.beepAudio.currentTime = 0;
      this.beepAudio.play().catch(err => {
        console.error('[Audio] Failed to play beep:', err);
      });
    }
  }

  // Private methods - Pause management
  private finishPause(): void {
    if (this.pauseTimerIntervalId !== undefined) {
      clearInterval(this.pauseTimerIntervalId);
      this.pauseTimerIntervalId = undefined;
    }

    // Accumulate pause duration
    this.totalPauseDuration.update(total => total + this.pauseTime());

    this.isPaused.set(false);
    this.currentState.set('ACTIVE');
    this.sendStateNotification('ACTIVE');
    this.nextPauseTime.set(30);

    console.log('[Pause] Finished - Duration:', this.formatTime(this.pauseTime()));
  }

  // Private methods - WebSocket notifications
  private sendStateNotification(state: MonitoringState): void {
    if (!this.wsService.connected()) {
      console.error('[WebSocket] Not connected - cannot send notification');

      // Cerrar toast anterior
      if (this.activeToastId) {
        toast.dismiss(this.activeToastId);
      }

      this.activeToastId = toast.error('Connection lost', {
        description: 'Notification server is unavailable',
        duration: 3000
      });
      return;
    }

    const config = this.STATE_NOTIFICATIONS[state];
    this.wsService.sendNotification(config.title, config.message);
    console.log(`[WebSocket] Notification sent: ${state}`);

    this.showStateToast(state);
  }

  private showStateToast(state: MonitoringState): void {
    const config = this.STATE_NOTIFICATIONS[state];

    // Cerrar toast anterior
    if (this.activeToastId) {
      toast.dismiss(this.activeToastId);
    }

    // Mapear tipo de toast
    const toastFunctions = {
      success: toast.success,
      warning: toast.warning,
      info: toast.info
    } as const;

    const toastFn = toastFunctions[config.toastType];

    this.activeToastId = toastFn(config.title, {
      description: config.toastDescription,
      duration: state === 'FINALIZED' ? 2000 : 3000
    });
  }

  // Private methods - Cleanup
  private cleanup(): void {
    if (this.currentState() !== 'FINALIZED') {
      this.sendStateNotification('FINALIZED');
    }

    this.cleanupTimers();
    this.cleanupAudio();
    this.wsService.disconnect();
  }

  private cleanupTimers(): void {
    const intervals = [
      this.monitoringIntervalId,
      this.badPostureIntervalId,
      this.pauseTimerIntervalId,
      this.nextPauseIntervalId
    ];

    for (const id of intervals) {
      if (id !== undefined) {
        clearInterval(id);
      }
    }
  }

  private cleanupAudio(): void {
    if (this.beepAudio) {
      this.beepAudio.pause();
      this.beepAudio = null;
    }
  }

  // Utility
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map(val => val.toString().padStart(2, '0'))
      .join(':');
  }
}
