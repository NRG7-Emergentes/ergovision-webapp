import { Component, ChangeDetectionStrategy, ElementRef, output, viewChild, signal } from '@angular/core';
import { FilesetResolver, PoseLandmarker, DrawingUtils, type PoseLandmarkerResult } from '@mediapipe/tasks-vision';

@Component({
  selector: 'app-monitor-cam',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'position: relative; display: block; width:100%; height:100%;'
  },
  template: `
    <video #videoEl playsinline></video>
    <canvas #canvasEl></canvas>
    <div class="log-controls">
      <button class="log-btn" (click)="logCurrentDistances()">Log distances</button>
    </div>
  `,
  styles: `
    :host { display:block; }
    video, canvas { width:100%; height:100%; object-fit:cover; display:block; }
    canvas { position:absolute; top:0; left:0; pointer-events:none; }
    .log-controls{position:absolute;left:12px;bottom:12px;z-index:20}
    .log-btn{background:rgba(17,24,39,0.9);color:#fff;padding:8px 12px;border-radius:8px;border:0;cursor:pointer}
  `
})
export class MonitorCamComponent {
  // Emit pose detection results to parent components
  readonly postureResults = output<PoseLandmarkerResult | null>();

  // Local state (signals)
  readonly isReady = signal(false);
  readonly errorMsg = signal<string | null>(null);

  // Template element references
  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('videoEl');
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasEl');

  // Internal resources
  private detectionIntervalId: number | undefined;
  // Logging control: only print landmarks every _logFrameInterval frames to reduce console spam
  private _logFrameInterval = 5;
  private _frameCounter = 0;
  // Keep latest detection results to allow on-demand logging
  private latestResults: PoseLandmarkerResult | null = null;
  private poseLandmarker: PoseLandmarker | undefined;
  private drawingUtils: DrawingUtils | undefined;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private mediaStream: MediaStream | undefined;
  private onLoadedData: (() => void) | undefined;

  async ngAfterViewInit(): Promise<void> {
    try {
      const video = this.videoRef().nativeElement;
      const canvas = this.canvasRef().nativeElement;

      this.canvasCtx = canvas.getContext('2d');
      if (!this.canvasCtx) {
        this.errorMsg.set('Unable to acquire 2D canvas context.');
        return;
      }

      this.drawingUtils = new DrawingUtils(this.canvasCtx);

      await this.initVideo(video);
      this.poseLandmarker = await this.initModel();

      this.startDetectionLoop(video, canvas);
      this.isReady.set(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Initialization failed';
      this.errorMsg.set(message);
    }
  }

  ngOnDestroy(): void {
    if (this.detectionIntervalId !== undefined) {
      clearInterval(this.detectionIntervalId);
      this.detectionIntervalId = undefined;
    }

    // Stop media tracks
    if (this.mediaStream) {
      for (const track of this.mediaStream.getTracks()) {
        track.stop();
      }
      this.mediaStream = undefined;
    }

    // Close model if the API supports it
    (this.poseLandmarker as { close?: () => void } | undefined)?.close?.();
    this.poseLandmarker = undefined;

    // Remove event listener if set
    const video = this.videoRef()?.nativeElement;
    if (video && this.onLoadedData) {
      video.removeEventListener('loadeddata', this.onLoadedData);
      this.onLoadedData = undefined;
    }
  }

  private startDetectionLoop(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    if (!this.poseLandmarker || !this.canvasCtx || !this.drawingUtils) return;

    this.detectionIntervalId = window.setInterval(() => {
      if (!this.poseLandmarker || !this.canvasCtx || !this.drawingUtils) return;

  const results = this.poseLandmarker.detectForVideo(video, performance.now());
  // Store latest results for on-demand inspection
  this.latestResults = results;

      // increment frame counter and determine whether to log this frame
      this._frameCounter = (this._frameCounter + 1) | 0;
      const shouldLog = (this._frameCounter % this._logFrameInterval) === 0;

      // Resize canvas to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw results
      this.canvasCtx!.save();
      this.canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);

      if (results.landmarks) {
        for (const landmark of results.landmarks) {
          this.drawingUtils.drawLandmarks(landmark, {
            radius: (data) => DrawingUtils.lerp(data!.from!.z, -0.15, 0.1, 5, 1)
          });
          this.drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
        }
        // NOTE: automatic logging removed — use the on-screen button to print distances on demand
      }

      this.canvasCtx!.restore();

      // Emit results to parent
      this.postureResults.emit(results);
    }, 1000 / 30);
  }

  private async initVideo(videoElement: HTMLVideoElement): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.mediaStream = stream;
    videoElement.srcObject = stream;

    this.onLoadedData = () => {
      // Ensure playback starts once data is available
      void videoElement.play();
    };

    videoElement.addEventListener('loadeddata', this.onLoadedData);
  }

  private async initModel(): Promise<PoseLandmarker> {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO'
    });

    return poseLandmarker;
  }

  // Public property (arrow function) so the template type-checker recognizes it
  public logCurrentDistances = (): void => {
    const results = this.latestResults;
    if (!results || !results.landmarks) {
      console.warn('[MonitorCam] No landmark data available to log');
      return;
    }

    try {
      results.landmarks.forEach((lmArr, personIdx) => {
        const p0 = lmArr[0];
        const p11 = lmArr[11];
        const p12 = lmArr[12];

        const formatPoint = (p: any) => (p ? `x:${p.x.toFixed(3)},y:${p.y.toFixed(3)},z:${(p.z ?? 0).toFixed(3)}` : 'null');

        let d0_11_norm: number | null = null;
        let d0_12_norm: number | null = null;
        let d0_11_px: number | null = null;
        let d0_12_px: number | null = null;

        if (p0 && p11) {
          const dx = p0.x - p11.x;
          const dy = p0.y - p11.y;
          d0_11_norm = Math.hypot(dx, dy);
          d0_11_px = Math.hypot(dx * (this.canvasRef().nativeElement.width), dy * (this.canvasRef().nativeElement.height));
        }

        if (p0 && p12) {
          const dx = p0.x - p12.x;
          const dy = p0.y - p12.y;
          d0_12_norm = Math.hypot(dx, dy);
          d0_12_px = Math.hypot(dx * (this.canvasRef().nativeElement.width), dy * (this.canvasRef().nativeElement.height));
        }

        // Detect bad posture when distances are < 0.3
        const isBadPosture = (d0_11_norm !== null && d0_11_norm < 0.23) || (d0_12_norm !== null && d0_12_norm < 0.23);
        const postureStatus = isBadPosture ? '⚠️ MALA POSTURA' : '✅ Postura OK';

        console.log(
          `[MonitorCam] (button) person=${personIdx} ${postureStatus} | ` +
            `p0: ${formatPoint(p0)} p11: ${formatPoint(p11)} p12: ${formatPoint(p12)} ` +
            `| dist0-11(norm:${d0_11_norm !== null ? d0_11_norm.toFixed(4) : 'N/A'}, px:${d0_11_px !== null ? d0_11_px.toFixed(1) : 'N/A'}) ` +
            `dist0-12(norm:${d0_12_norm !== null ? d0_12_norm.toFixed(4) : 'N/A'}, px:${d0_12_px !== null ? d0_12_px.toFixed(1) : 'N/A'})`
        );
      });
    } catch (err) {
      console.warn('[MonitorCam] Error computing distances on demand', err);
    }
  };
}
