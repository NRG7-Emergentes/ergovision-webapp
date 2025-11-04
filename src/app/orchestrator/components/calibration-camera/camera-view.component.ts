// typescript
import { Component, ChangeDetectionStrategy, signal, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {ZardButtonComponent} from '@shared/components/button/button.component';

@Component({
  selector: 'app-camera-view',
  template: `
    <div class="camera-root">
      <div class="view">
        @if (isStreaming()) {
          <ng-container>
            <video #video autoplay playsinline muted class="video"></video>
          </ng-container>
        } @else {
          <ng-container>
            <div class="video"
                 style="display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; text-align: center; padding: 16px;">
              <p>Press start to begin the calibration</p>
            </div>
          </ng-container>
        }
      </div>

      <div class="controls">
        @if(isStreaming()) {
          <z-button zType="secondary" zSize="lg">Start</z-button>
          <z-button (click)="stopCamera()" zSize="lg">Stop</z-button>
        } @else {
          <z-button (click)="startCamera()" zSize="lg">Start</z-button>
          <z-button zType="secondary" zSize="lg">Stop</z-button>
        }
      </div>
    </div>
  `,
  styles: [`
    .camera-root {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .view {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .video {
      width: 800px;
      height: 460px;
      max-width: 66vw;
      border-radius: 10px;
      background: #000;
    }

    .controls {
      display: flex;
      gap: 8px;
    }
  `],
  imports: [
    ZardButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') private videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private _stream = signal<MediaStream | null>(null);
  isStreaming = computed(() => !!this._stream());

  ngAfterViewInit(): void {
    // opcional: auto-start si se desea
  }

  async startCamera(): Promise<void> {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      this._stream.set(s);

      await new Promise(requestAnimationFrame);

      const video = this.videoRef?.nativeElement;
      if (!video) {
        console.warn('videoRef no está disponible después de renderizar');
        return;
      }

      try {
        (video as HTMLVideoElement).srcObject = s;
      } catch {
        (video as unknown as { src: string }).src = URL.createObjectURL(s as unknown as MediaSource);
      }

      await video.play();
    } catch (err) {
      console.error('No se pudo acceder a la cámara:', err);
    }
  }

  stopCamera(): void {
    const s = this._stream();
    if (!s) return;
    s.getTracks().forEach(t => t.stop());
    this._stream.set(null);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
