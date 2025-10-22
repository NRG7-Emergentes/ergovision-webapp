import { Component, ChangeDetectionStrategy, ElementRef, output, viewChild, signal } from '@angular/core';
import { FilesetResolver, PoseLandmarker, DrawingUtils, type PoseLandmarkerResult } from '@mediapipe/tasks-vision';

@Component({
  selector: 'app-monitor-cam',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'position: relative; display: block;'
  },
  template: `
    <video #videoEl class="w-full h-auto " playsinline></video>
    <canvas #canvasEl style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none"></canvas>
  `,
  styles: ``
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
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO'
    });

    return poseLandmarker;
  }
}
