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
          <div class="video-card">
            <div class="video-wrap">
              <app-monitor-cam class="monitor-video"></app-monitor-cam>
            </div>
            <div class="card-bottom">
              <div class="note">Live preview</div>
              <div class="controls">
                <button z-button (click)="onCalibrate()" class="btn ghost">Calibrate</button>
                <button z-button (click)="onStart()" class="btn primary">Start</button>
              </div>
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
            <h4>Remember to not turn off the camera while monitoring is active</h4>
          </div>
  </aside>
        </div>
      </div>
    </div>
  `,
  styles: [`
  :host { --monitor-video-height: 60vh; display: block; font-family: Inter, Arial, sans-serif; color:#111827 }
    .topbar{height:56px;background:#0f172a;color:#fff;display:flex;align-items:center;gap:16px;padding:0 16px}
    .topbar .brand{font-weight:700}
    .topbar .nav{opacity:0.85}
  /* make content take almost whole viewport and allow larger video */
  .content{display:flex;gap:20px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw;min-height:calc(100vh - 88px)}
  .main-col{flex:1;max-width:2200px;margin-left:20px;display:flex;flex-direction:column}
  /* make sidebar wider so recommendations occupy more horizontal space */
  /* make sidebar even wider so recommendations occupy more horizontal space */
  .sidebar{width:480px;flex:0 0 480px;display:flex;flex-direction:column}
    /* let the video area size match the natural camera component (same as Monse) */
  /* make camera area match Monse: fixed height and controls below the camera */
  .video-card{background:#ffffff;border-radius:10px;box-shadow:0 8px 24px rgba(2,6,23,0.12);overflow:hidden;display:flex;flex-direction:column}
  .video-wrap{width:100%;overflow:hidden;height:720px}
  /* place controls below the camera (normal flow) */
  .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #eef2f6;background:transparent}
  .note{color:#6b7280;font-size:13px}
  .monitor-video{width:100%;height:100%;object-fit:cover;display:block}
  /* make the camera wider by allowing the main column to be wider */
  .video-card{margin-left:20px}
  /* larger buttons */
  .controls .btn{margin-left:12px;padding:20px 28px;border-radius:12px;border:0;cursor:pointer;font-weight:700;font-size:22px}
  .card-bottom .btn.ghost{padding:18px 24px}
  /* recommendations larger */
  /* recommendations: wider and no scroll -- larger typography and spacing */
  .recommendations.card{background:#ffffff;padding:32px 28px;border-radius:12px;font-size:22px;display:flex;flex-direction:column;justify-content:center;overflow:visible;max-height:none;min-height:auto;width:100%}
  .recommendations.card h2{font-size:24px;margin:0 0 8px}
  .recommendations.card h4{font-size:20px;margin:0}
  .recommendations.card p{font-size:20px;line-height:1.4;margin:0}
  /* make the info cards larger/readable */
  .info-card{font-size:20px;padding:20px}
  .settings.card{padding:28px;border-radius:12px;font-size:20px;display:flex;flex-direction:column;justify-content:flex-start;overflow:visible;max-height:none;min-height:auto;background:#ffffff}
  .monitoring-page, .content { box-sizing: border-box; }
      .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #eef2f6}
      .note{color:#6b7280;font-size:13px}
  .controls .btn{margin-left:10px;padding:10px 16px;border-radius:8px;border:0;cursor:pointer;font-weight:600}
      .btn.primary{background:#2563eb;color:white}
      .btn.success{background:#10b981;color:white}
  .recommendations.card{background:#f8fafc;padding:18px;border-radius:10px}
      .info-row{display:flex;gap:14px;margin-top:14px}
      .info-card{flex:1;background:#f3f4f6;padding:14px;border-radius:8px;text-align:center;font-weight:600}
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
