import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '@app/monitoring/presentation/monitoring-view/monitoring.service';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'monitoring-start',
  imports: [MonitorCamComponent, ZardButtonComponent],
  template: `
    <div class="bg-background min-h-screen">
      <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="content">
        <main class="main-col">
          <div class="monse-cam-wrap">
            <app-monitor-cam class="monitor-video"></app-monitor-cam>
          </div>
          <div class="card-bottom bg-card border-t border-border">
            <div class="note text-foreground">Live preview</div>
            <div class="controls">
              <button z-button (click)="onCalibrate()" class="btn primary">Calibrate</button>
              <button z-button (click)="onStart()" class="btn success">Start</button>
            </div>
          </div>

          <div class="info-row">
            <div class="info-card bg-card text-card-foreground border border-border">Good posture Time: <strong>{{ goodTime }}</strong></div>
            <div class="info-card bg-card text-card-foreground border border-border">Active break duration: <strong>{{ pauseTime }}</strong></div>
          </div>
  </main>

  <aside class="sidebar">
          <div class="recommendations card bg-card text-card-foreground border border-border">
            <h2 class="text-foreground">Recommendations</h2>
            <ul class="rec-list text-muted-foreground">
              <li>Keep your back straight and shoulders relaxed.</li>
              <li>Adjust your chair height so your feet rest flat on the floor.</li>
              <li>Position the screen at eye level to avoid neck strain.</li>
              <li>Take short micro-breaks every 20–30 minutes to stretch.</li>
              <li>Keep elbows close to your body and at a 90° angle when typing.</li>
              <li>Ensure the camera shows your upper body and shoulders for accurate posture detection.</li>
            </ul>
          </div>
  </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
  :host { display:block }
  .content{display:flex;gap:20px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw;min-height:calc(100vh - 88px)}
  .main-col{flex:1;max-width:2200px;margin-left:20px;display:flex;flex-direction:column}
  .sidebar{width:480px;flex:0 0 480px;display:flex;flex-direction:column}
  .monse-cam-wrap{width:100%;}
  .monitor-video{width:100%;height:auto;object-fit:cover;display:block}
  .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px}
  .controls .btn{margin-left:12px;padding:18px 32px;border-radius:12px;border:0;cursor:pointer;font-weight:700;font-size:18px}
  .btn.success{background:#10b981;color:white}
  .btn.primary{background:#2563eb;color:white}
  .info-card{font-size:18px;padding:18px;border-radius:10px;text-align:center}
  .info-card strong{color:var(--card-foreground)}
  .info-row{display:flex;gap:20px;margin-top:18px}
  .recommendations.card{border-radius:12px;font-size:18px;width:100%;padding:24px;background:#f3f4f6}
  .recommendations.card h2{font-size:20px;margin:0 0 16px;font-weight:600;color:#111827}
  .recommendations.card ul{list-style:disc;padding-left:24px;margin:0}
  .recommendations.card li{margin-bottom:10px;line-height:1.6}
  `]
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
