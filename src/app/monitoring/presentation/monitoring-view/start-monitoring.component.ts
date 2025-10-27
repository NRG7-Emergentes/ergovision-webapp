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
    <div class="monitoring-page">

      <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="content">
        <main class="main-col">
          <div class="monse-cam-wrap">
            <app-monitor-cam class="monitor-video"></app-monitor-cam>
          </div>
          <div class="card-bottom">
            <div class="note">Live preview</div>
            <div class="controls">
              <button z-button (click)="onCalibrate()" class="btn ghost">Calibrate</button>
              <button z-button (click)="onStart()" class="btn primary">Start</button>
            </div>
          </div>

          <div class="info-row">
            <div class="info-card">Good posture Time: <strong>{{ goodTime }}</strong></div>
            <div class="info-card">Active break duration: <strong>{{ pauseTime }}</strong></div>
          </div>
  </main>

  <aside class="sidebar">
          <div class="recommendations card">
            <h2>Recommendations</h2>
            <ul class="rec-list">
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
  :host { --monitor-video-height: 60vh; display: block; font-family: Inter, Arial, sans-serif; color:#111827 }
  /* layout */
  .content{display:flex;gap:20px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw;min-height:calc(100vh - 88px)}
  .main-col{flex:1;max-width:2200px;margin-left:20px;display:flex;flex-direction:column}
  .sidebar{width:480px;flex:0 0 480px;display:flex;flex-direction:column}
  .monse-cam-wrap{width:100%;}
  .monitor-video{width:100%;height:auto;object-fit:cover;display:block}
  .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #eef2f6;background:transparent}
  .note{color:#6b7280;font-size:13px}

  /* buttons - standardized */
  .controls .btn{margin-left:12px;padding:18px 32px;border-radius:12px;border:0;cursor:pointer;font-weight:700;font-size:18px}
  .card-bottom .btn.ghost{padding:14px 24px;font-weight:600}
  .btn.primary{background:#2563eb;color:white}
  .btn.success{background:#10b981;color:white}

  /* recommendations card */
  .recommendations.card{background:#ffffff;padding:28px;border-radius:12px;font-size:18px;display:flex;flex-direction:column;justify-content:flex-start;overflow:auto;flex:1;min-height:420px}
  .recommendations.card h2{font-size:22px;margin:0 0 12px}
  .recommendations.card .rec-list{margin:0;padding-left:20px;display:block;gap:12px}
  .recommendations.card .rec-list li{margin-bottom:12px;font-size:16px;line-height:1.5}

  /* info cards and settings */
  .info-card{font-size:18px;padding:18px;border-radius:10px;background:#f3f4f6;text-align:center}
  .settings.card{padding:20px;border-radius:12px;font-size:18px;display:flex;flex-direction:column;justify-content:flex-start;overflow:visible;max-height:none;min-height:auto;background:#ffffff}
  .monitoring-page, .content { box-sizing: border-box; }
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
