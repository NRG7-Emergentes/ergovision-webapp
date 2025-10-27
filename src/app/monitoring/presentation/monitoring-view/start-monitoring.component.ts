import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '@app/monitoring/presentation/monitoring-view/monitoring.service';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'monitoring-start',
  imports: [MonitorCamComponent, ZardButtonComponent],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-row-reverse gap-4">
        <div class="flex-1">
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <span class="text-xl font-bold text-foreground mb-4 -tracking-normal">Recommendations</span>
            <div class="flex flex-col gap-4">
              <div>
                a
              </div>
              <div>
                b
              </div>
              <div>
                c
              </div>
            </div>
          </div>
        </div>
        <div class="flex-2 overflow-hidden rounded-lg border ">
          <div class="w-full h-auto object-cover block">
            <app-monitor-cam/>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: []
})
export class StartMonitoringComponent {
  totalTime = '00:00:00';
  goodTime = '00:00:00';
  pauseTime = '00:00:00';
  private _interval: any;

  constructor(private router: Router, private monitoringSvc: MonitoringService) {}

  ngOnInit(): void {
    this._interval = setInterval(() => this.refreshTimes(), 500);
  }

  ngOnDestroy(): void {
    if (this._interval) clearInterval(this._interval);
  }

  onCalibrate() {
    alert('Calibrating...');
  }

  onStart() {
    // start monitoring stats + navigate
    this.monitoringSvc.start();
    this.router.navigate(['/monitoring/active']);
  }

  private refreshTimes() {
    const s = this.monitoringSvc.getStats();
    this.totalTime = this.msToHms(s.totalMs);
    this.goodTime = this.msToHms(s.goodMs);
    this.pauseTime = this.msToHms(s.pauseMs);
  }

  private msToHms(ms: number) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
}
