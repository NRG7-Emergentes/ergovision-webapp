import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {ZardDividerComponent} from '@shared/components/divider/divider.component';
import {MonitorCamComponent} from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import type {PoseLandmarkerResult} from '@mediapipe/tasks-vision';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-calibration-page',
  imports: [
    ZardDividerComponent,
    MonitorCamComponent,
    ZardButtonComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8 ">
        <h1 class="text-3xl font-bold text-foreground tracking-tight">Calibration Setup</h1>
        <p class="text-muted-foreground "> Configure your camera and position for optimal posture monitoring </p>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="col-span-2">
          @if (cameraAvailable()) {
            <div class="w-full h-auto object-cover block rounded-lg overflow-hidden relative">
              <app-monitor-cam (postureResults)="onPostureResults($event)" />
              @if (isCalibrating()) {
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-8xl font-bold text-white">{{ calibrationCountdown() }}</div>
                    <p class="text-xl text-white mt-4">Hold your position...</p>
                  </div>
                </div>
              }
            </div>
          } @else {
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
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">How to Sit Correctly</h2>
            <div class="space-y-4 mb-8 flex-1">
              <div  class="flex gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary">1</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-foreground">Position Your Chair</h3>
                  <p class="text-xs text-muted-foreground mt-1 ">
                    Ensure your feet are flat on the floor and your knees are at a 90-degree angle.
                  </p>
                </div>


              </div>

              <div  class="flex gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary">2</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-foreground">Monitor Height</h3>
                  <p class="text-xs text-muted-foreground mt-1 ">
                    The top of your screen should be at or slightly below eye level.
                  </p>
                </div>


              </div>

              <div  class="flex gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary">3</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-foreground">Back Support</h3>
                  <p class="text-xs text-muted-foreground mt-1 ">
                    Keep your back straight and shoulders relaxed, maintaining the natural curve of your spine.
                  </p>
                </div>


              </div>

              <div  class="flex gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-sm font-semibold text-primary">4</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-foreground">Camera Distance</h3>
                  <p class="text-xs text-muted-foreground mt-1 ">
                    Position yourself at an arm's length distance from your camera for optimal tracking.
                  </p>
                </div>


              </div>



            </div>
            <z-divider/>
            <h3 class="text-sm font-semibold text-foreground mb-4">Calibration Metrics</h3>
            <div class="space-y-4">
              <div class="bg-secondary rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p class="text-xs text-muted-foreground">Camera Distance</p>
                  @if (cameraDistance() === 0) {
                    <p class="text-sm font-semibold text-muted-foreground mt-1">Not Detecting</p>
                  } @else {
                    <p class="text-sm font-semibold text-foreground mt-1">{{cameraDistance()}} cm</p>
                  }
                </div>

                @if (cameraDistance() === 0) {
                  <span class="text-xs font-semibold text-muted-foreground"> — </span>
                } @else if (cameraDistance() >= 20 && cameraDistance() <= 100) {
                  <span class="text-xs font-semibold text-green-400"> Optimal </span>
                } @else {
                  <span class="text-xs font-semibold text-red-400"> Not Optimal </span>
                }
              </div>
              <div class="bg-secondary rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p class="text-xs text-muted-foreground">Lighting Quality</p>
                  @if (cameraVisibility() === 0) {
                    <p class="text-sm font-semibold text-muted-foreground mt-1">Not Detecting</p>
                  } @else {
                    <p class="text-sm font-semibold text-foreground mt-1">{{cameraVisibility()}}%</p>
                  }
                </div>

                @if (cameraVisibility() === 0) {
                  <span class="text-xs font-semibold text-muted-foreground"> — </span>
                } @else if (cameraVisibility() < 60) {
                  <span class="text-xs font-semibold text-red-400"> Poor Light </span>
                } @else if (cameraVisibility() < 80) {
                  <span class="text-xs font-semibold text-yellow-400"> Fair Light </span>
                } @else {
                  <span class="text-xs font-semibold text-green-400"> Good Light </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 ">
        <button z-button zType="outline" zSize="lg"> Go to Settings </button>
        <button z-button zSize="lg" (click)="startCalibration()" [disabled]="isCalibrating() || isCalibrated()">
          @if (isCalibrating()) {
            Calibrating... {{ calibrationCountdown() }}s
          } @else if (isCalibrated()) {
            Calibrated ✓
          } @else {
            Start Calibration
          }
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class CalibrationPageComponent implements OnInit, OnDestroy{

  protected readonly cameraAvailable = signal<boolean>(false);

  protected readonly cameraDistance = signal<number>(0);
  protected readonly cameraVisibility = signal<number>(0);

  protected readonly isCalibrating = signal<boolean>(false);
  protected readonly calibrationCountdown = signal<number>(0);
  protected readonly isCalibrated = signal<boolean>(false);

  private calibrationTimeout: number | undefined;
  private countdownInterval: number | undefined;
  private latestDistance = 0;
  private latestVisibility = 0;

  // MediaPipe pose landmark indices
  private readonly POSE_LANDMARKS = {
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    NOSE: 0,
    LEFT_EYE: 2,
    RIGHT_EYE: 5,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26
  };

  ngOnInit(): void {
    this.checkCameraAvailability();
  }

  async checkCameraAvailability(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    try {
      // We request video access and immediately stop the tracks.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.cameraAvailable.set(true);
    } catch (err) {
      this.cameraAvailable.set(false);
    }
  }

  onPostureResults(results: PoseLandmarkerResult | null): void {
    if (!results || !results.landmarks || results.landmarks.length === 0) {
      return;
    }

    const landmarks = results.landmarks[0];

    // Calculate camera distance based on shoulder width
    const distance = this.calculateCameraDistance(landmarks);
    const visibility = this.calculateVisibility(landmarks);

    if (this.isCalibrated()) {
      // If already calibrated, just store the latest values without updating the display
      this.latestDistance = distance > 0 ? Math.round(distance) : 0;
      this.latestVisibility = Math.round(visibility);
    } else {
      // Update display in real-time during calibration or before calibration
      if (distance > 0) {
        this.cameraDistance.set(Math.round(distance));
        this.latestDistance = Math.round(distance);
      }
      this.cameraVisibility.set(Math.round(visibility));
      this.latestVisibility = Math.round(visibility);
    }
  }

  private calculateCameraDistance(landmarks: Array<{x: number, y: number, z: number, visibility?: number}>): number {
    const leftShoulder = landmarks[this.POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[this.POSE_LANDMARKS.RIGHT_SHOULDER];

    if (!leftShoulder || !rightShoulder) {
      return 0;
    }

    // Calculate the distance between shoulders in normalized coordinates
    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) +
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
    );

    // Average shoulder width is approximately 40cm
    // This is a rough estimation: distance = (real_width / perceived_width) * focal_length_factor
    // The focal length factor is empirically set to 0.5 for typical webcams
    const AVERAGE_SHOULDER_WIDTH_CM = 40;
    const FOCAL_LENGTH_FACTOR = 0.5;

    if (shoulderWidth === 0) return 0;

    return (AVERAGE_SHOULDER_WIDTH_CM / shoulderWidth) * FOCAL_LENGTH_FACTOR;
  }

  private calculateVisibility(landmarks: Array<{x: number, y: number, z: number, visibility?: number}>): number {
    // Key upper body landmarks that should be well-lit (excluding hips)
    const keyLandmarkIndices = [
      this.POSE_LANDMARKS.NOSE,
      this.POSE_LANDMARKS.LEFT_EYE,
      this.POSE_LANDMARKS.RIGHT_EYE,
      this.POSE_LANDMARKS.LEFT_SHOULDER,
      this.POSE_LANDMARKS.RIGHT_SHOULDER,
      this.POSE_LANDMARKS.LEFT_ELBOW,
      this.POSE_LANDMARKS.RIGHT_ELBOW
    ];

    let totalVisibility = 0;
    let detectedLandmarks = 0;
    const visibilityScores: { [key: string]: number } = {};

    for (const index of keyLandmarkIndices) {
      const landmark = landmarks[index];
      if (landmark && landmark.visibility !== undefined) {
        // MediaPipe's visibility score represents how well-lit/visible the landmark is
        // 0.0 = completely obscured/dark, 1.0 = clearly visible/well-lit
        totalVisibility += landmark.visibility;
        detectedLandmarks++;

        // Log each landmark's visibility for debugging
        const landmarkName = Object.keys(this.POSE_LANDMARKS).find(
          key => this.POSE_LANDMARKS[key as keyof typeof this.POSE_LANDMARKS] === index
        );
        if (landmarkName) {
          visibilityScores[landmarkName] = landmark.visibility;
        }
      }
    }

    //console.log('Visibility scores:', visibilityScores);
    //console.log(`Total visibility: ${totalVisibility}, Detected landmarks: ${detectedLandmarks}`);

    if (detectedLandmarks === 0) return 0;

    // Return average visibility as percentage (illumination quality)
    // This measures the lighting quality of detected key landmarks
    return (totalVisibility / detectedLandmarks) * 100;
  }

  startCalibration(){
    // Prevent starting calibration if already calibrating
    if (this.isCalibrating()) {
      return;
    }

    // Check if pose is being detected
    if (this.latestDistance === 0 || this.latestVisibility === 0) {
      toast.error('No pose detected. Please position yourself in front of the camera.');
      return;
    }

    // Start calibration process
    this.isCalibrating.set(true);
    this.isCalibrated.set(false);
    this.calibrationCountdown.set(5);

    toast.info('Calibration started. Hold your position...');

    // Countdown timer
    this.countdownInterval = window.setInterval(() => {
      const currentCount = this.calibrationCountdown();
      if (currentCount > 1) {
        this.calibrationCountdown.set(currentCount - 1);
      } else {
        // Clear countdown interval
        if (this.countdownInterval !== undefined) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = undefined;
        }
      }
    }, 1000);

    // Finish calibration after 5 seconds
    this.calibrationTimeout = window.setTimeout(() => {
      // Freeze the current values
      this.cameraDistance.set(this.latestDistance);
      this.cameraVisibility.set(this.latestVisibility);

      // Update state
      this.isCalibrating.set(false);
      this.isCalibrated.set(true);
      this.calibrationCountdown.set(0);

      // Show success message
      toast.success('Calibration finished!');
    }, 5000);
  }

  ngOnDestroy(): void {
    // Clean up timers
    if (this.calibrationTimeout !== undefined) {
      clearTimeout(this.calibrationTimeout);
      this.calibrationTimeout = undefined;
    }
    if (this.countdownInterval !== undefined) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

}
