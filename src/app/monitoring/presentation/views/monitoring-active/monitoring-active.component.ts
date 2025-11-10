import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MonitorCamComponent} from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';
import {FormsModule} from '@angular/forms';
import {ZardSliderComponent} from '@shared/components/slider/slider.component';
import {Router} from '@angular/router';
import {ZardDialogService} from '@shared/components/dialog/dialog.service';
import {
  ActivePauseDialogComponent
} from '@app/monitoring/presentation/components/active-pause-dialog/active-pause-dialog.component';
import type {PoseLandmarkerResult} from '@mediapipe/tasks-vision';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-monitoring-active',
  imports: [
    MonitorCamComponent,
    ZardButtonComponent,
    ZardSwitchComponent,
    FormsModule,
    ZardSliderComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="col-span-2 overflow-hidden rounded-lg border ">
          <div class="w-full h-auto object-cover block">
            <app-monitor-cam (postureResults)="onPostureResults($event)"/>
          </div>
        </div>
        <div class="col-span-1 space-y-4">
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full ">

            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Pauses</h2>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="text-md"> Next Pause in: </span>
                <span class="text-md text-muted-foreground"> {{ formatTime(nextPauseTime()) }} </span>
              </div>
              <button z-button (click)="onPauseInit()">
                <i class="icon-pause  "></i>
                Pause
              </button>
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

              <div class="flex items-center gap-4">
                <z-slider class="w-full" [zMin]="0" [zMax]="100" [zStep]="1" [zValue]="noseOffsetSensitivity()"
                          [zDefault]="noseOffsetSensitivity()" (onSlide)="noseOffsetSensitivity.set($event)"/>
                <span class="text-sm text-muted-foreground min-w-10"> {{ noseOffsetSensitivity() }} % </span>

              </div>




            </div>
            <div class="p-4 bg-secondary rounded-lg ">
              @if (isBadPosture()) {
                <p class="text-2xl font-bold text-red-800">Bad Posture</p>
              } @else {
                <p class="text-2xl font-bold">You're sitting well</p>
              }
              <div class="text-muted-foreground text-md">
                <span> Nose Offset:  </span>
                <span> {{ noseOffset().toFixed(1) }}% </span>
              </div>
            </div>
          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Time </h2>

            <div class="flex justify-between items-center">
              <span class="text-md"> Monitoring time: </span>
              <span class="text-md text-muted-foreground"> {{ formatTime(monitoringTime()) }} </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-md"> Bad posture time: </span>
              <span class="text-md text-muted-foreground"> {{ formatTime(badPostureTime()) }} </span>
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
  protected readonly visualAlerts = signal<boolean>(true);
  protected readonly soundAlerts = signal<boolean>(true);

  protected readonly alertInterval = signal<string>("10");

  protected readonly noseOffsetSensitivity = signal<number>(90);
  protected readonly noseOffset = signal<number>(0);
  protected readonly isBadPosture = signal<boolean>(false);

  // Time tracking
  protected readonly monitoringTime = signal<number>(0); // in seconds
  protected readonly badPostureTime = signal<number>(0); // in seconds
  protected readonly nextPauseTime = signal<number>(30); // in seconds

  // Pause tracking
  protected readonly isPaused = signal<boolean>(false);
  protected readonly pauseTime = signal<number>(0); // current pause duration in seconds
  protected readonly pausesTaken = signal<number>(0); // total number of pauses in this session

  private router = inject(Router);
  private dialogService = inject(ZardDialogService);

  // Pause timer
  private pauseTimerInterval: number | undefined;
  private nextPauseInterval: number | undefined;

  // MediaPipe pose landmark indices
  private readonly POSE_LANDMARKS = {
    NOSE: 0,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12
  };

  // Timers
  private monitoringInterval: number | undefined;
  private badPostureInterval: number | undefined;

  // Bad posture detection
  private badPostureStartTime: number | null = null;
  private lastAlertTime: number | null = null;
  private readonly BAD_POSTURE_ALERT_THRESHOLD = 10; // seconds

  // Posture thresholds
  private readonly NOSE_SHOULDER_DISTANCE_THRESHOLD = 0.15; // normalized distance
  private readonly CAMERA_DISTANCE_THRESHOLD = 42; // minimum distance in cm (too close if less than 50cm)

  // Audio for bad posture alert
  private beepAudio: HTMLAudioElement | null = null;

  ngOnInit(): void {
    // Initialize audio
    this.beepAudio = new Audio('/assets/beep.opus');
    this.beepAudio.load();

    // Start monitoring timer (only increments when not paused)
    this.monitoringInterval = window.setInterval(() => {
      if (!this.isPaused()) {
        this.monitoringTime.set(this.monitoringTime() + 1);
      }
    }, 1000);

    // Start next pause timer
    this.nextPauseInterval = window.setInterval(() => {
      if (!this.isPaused()) {
        this.nextPauseTime.update(t => t - 1);
        if (this.nextPauseTime() <= 0) {
          this.onPauseInit();
        }
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // Clean up timers
    if (this.monitoringInterval !== undefined) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    if (this.badPostureInterval !== undefined) {
      clearInterval(this.badPostureInterval);
      this.badPostureInterval = undefined;
    }
    if (this.pauseTimerInterval !== undefined) {
      clearInterval(this.pauseTimerInterval);
      this.pauseTimerInterval = undefined;
    }
    if (this.nextPauseInterval !== undefined) {
      clearInterval(this.nextPauseInterval);
      this.nextPauseInterval = undefined;
    }

    // Clean up audio
    if (this.beepAudio) {
      this.beepAudio.pause();
      this.beepAudio = null;
    }
  }

  onPostureResults(results: PoseLandmarkerResult | null): void {
    // Skip posture detection when paused
    if (this.isPaused()) {
      return;
    }

    if (!results || !results.landmarks || results.landmarks.length === 0) {
      return;
    }

    const landmarks = results.landmarks[0];

    // Get nose and shoulders landmarks
    const nose = landmarks[this.POSE_LANDMARKS.NOSE];
    const leftShoulder = landmarks[this.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[this.POSE_LANDMARKS.RIGHT_SHOULDER];

    if (!nose || !leftShoulder || !rightShoulder) {
      return;
    }

    // Calculate midpoint of shoulders
    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2
    };

    // Calculate vertical distance between nose and shoulders (Y-axis)
    const noseShoulderDistance = Math.abs(nose.y - shoulderMidpoint.y);

    // Calculate camera distance based on shoulder width (same as calibration page)
    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) +
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    );
    const AVERAGE_SHOULDER_WIDTH_CM = 40;
    const FOCAL_LENGTH_FACTOR = 0.5;
    const cameraDistance = shoulderWidth > 0 ? (AVERAGE_SHOULDER_WIDTH_CM / shoulderWidth) * FOCAL_LENGTH_FACTOR : 0;

    // Calculate nose offset percentage (0-100%)
    const noseOffsetPercentage = noseShoulderDistance * 100;
    this.noseOffset.set(noseOffsetPercentage);

    // Determine if posture is bad
    // Bad posture if: nose is too close to shoulders (slouching) OR camera distance is too close (leaning forward)
    // THERE ITS THE OPTION TO JUST USER THE OFFSET SENTITIVITY AS THE OBJECT TO COMPARE
    const isNoseTooClose = noseShoulderDistance < (this.noseOffsetSensitivity() / 100) * this.NOSE_SHOULDER_DISTANCE_THRESHOLD;
    const isTooCloseToCamera = cameraDistance > 0 && cameraDistance < this.CAMERA_DISTANCE_THRESHOLD;

    //console.log('noseShoulderDistance:', noseShoulderDistance.toFixed(3));
    //console.log('threshold:', ((this.noseOffsetSensitivity() / 100) * this.NOSE_SHOULDER_DISTANCE_THRESHOLD).toFixed(3));
    //console.log('cameraDistance:', cameraDistance.toFixed(1), 'cm');
    //console.log('isNoseTooClose:', isNoseTooClose);
    //console.log('isTooCloseToCamera:', isTooCloseToCamera);

    const badPosture = isNoseTooClose || isTooCloseToCamera;
    this.isBadPosture.set(badPosture);

    // Handle bad posture detection
    if (badPosture) {
      // Start tracking bad posture time
      if (this.badPostureStartTime === null) {
        this.badPostureStartTime = Date.now();
        this.lastAlertTime = null;
      }

      // Increment bad posture time counter
      if (this.badPostureInterval === undefined) {
        this.badPostureInterval = window.setInterval(() => {
          this.badPostureTime.set(this.badPostureTime() + 1);
        }, 1000);
      }

      // Check if bad posture has been detected for more than 10 seconds
      const badPostureDuration = (Date.now() - this.badPostureStartTime) / 1000;

      // Show alert every 10 seconds
      if (badPostureDuration >= this.BAD_POSTURE_ALERT_THRESHOLD) {
        const timeSinceLastAlert = this.lastAlertTime
          ? (Date.now() - this.lastAlertTime) / 1000
          : badPostureDuration;

        if (timeSinceLastAlert >= this.BAD_POSTURE_ALERT_THRESHOLD) {
          // Show toast if visual alerts are enabled
          if (this.visualAlerts()) {
            toast.error('Bad Posture detected');
          }

          // Play beep sound if sound alerts are enabled
          if (this.soundAlerts() && this.beepAudio) {
            this.beepAudio.currentTime = 0; // Reset to start
            this.beepAudio.play().catch(err => {
              console.error('Failed to play beep sound:', err);
            });
          }

          this.lastAlertTime = Date.now();
        }
      }
    } else {
      // Good posture - reset bad posture tracking
      this.badPostureStartTime = null;
      this.lastAlertTime = null;

      // Stop bad posture time increment
      if (this.badPostureInterval !== undefined) {
        clearInterval(this.badPostureInterval);
        this.badPostureInterval = undefined;
      }
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onFinishSession(){
    this.router.navigate(['/history']);
  }

  onPauseInit(){
    // Set pause state
    this.isPaused.set(true);

    // Increment pauses taken
    this.pausesTaken.set(this.pausesTaken() + 1);

    // Reset pause time for this pause
    this.pauseTime.set(0);

    // Start pause timer
    this.pauseTimerInterval = window.setInterval(() => {
      this.pauseTime.set(this.pauseTime() + 1);
    }, 1000);

    // Open pause dialog
    this.dialogService.create({
      zContent: ActivePauseDialogComponent,
      zData: {
        pauseTime: this.pauseTime,
        pausesTaken: this.pausesTaken
      },
      zOkText: 'Finish Pause',
      zCancelText: null,
      zOnOk: () => {
        this.onPauseFinish();
      },
      zWidth: '1280px',
      zClosable: false,
    });
  }

  private onPauseFinish(): void {
    // Stop pause timer
    if (this.pauseTimerInterval !== undefined) {
      clearInterval(this.pauseTimerInterval);
      this.pauseTimerInterval = undefined;
    }

    // Resume monitoring
    this.isPaused.set(false);

    // Reset next pause timer
    this.nextPauseTime.set(30);

    console.log('Pause Finished - Total pause time:', this.formatTime(this.pauseTime()));
  }


}
