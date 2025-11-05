import {Component, OnInit, signal} from '@angular/core';
import {ZardDividerComponent} from '@shared/components/divider/divider.component';
import {MonitorCamComponent} from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';

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
            <div class="w-full h-auto object-cover block rounded-lg overflow-hidden">
              <app-monitor-cam />
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
                  <p class="text-sm font-semibold text-foreground mt-1">75 cm</p>
                </div>
                <span class="text-xs font-semibold text-green-400"> Optimal </span>
              </div>
              <div class="bg-secondary rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p class="text-xs text-muted-foreground">Camera Visibility</p>
                  <p class="text-sm font-semibold text-foreground mt-1">95%</p>
                </div>
                <span class="text-xs font-semibold text-green-400"> Optimal </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 ">
        <button z-button zType="outline" zSize="lg"> Go Back </button>
        <button z-button zSize="lg"> Start Calibration </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class CalibrationPageComponent implements OnInit{

  ngOnInit(): void {
    this.checkCameraAvailability();
  }
  protected readonly cameraAvailable = signal<boolean>(false);

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

}
