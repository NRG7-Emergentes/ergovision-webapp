import { Component } from '@angular/core';
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
            <div class="info-card">Good posture Time: <strong>01:24:23</strong></div>
            <div class="info-card">Active break duration: <strong>00:00:32</strong></div>
          </div>
        </main>

        <aside class="sidebar">
          <div class="recommendations card">
            <h4>Recommendations</h4>
            <p>Remember to not turn off the camera while monitoring is active</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
  :host { --monitor-video-height: 70vh; display: block; font-family: Inter, Arial, sans-serif; color:#111827 }
    .topbar{height:56px;background:#0f172a;color:#fff;display:flex;align-items:center;gap:16px;padding:0 16px}
    .topbar .brand{font-weight:700}
    .topbar .nav{opacity:0.85}
  .content{display:flex;gap:24px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw}
  .main-col{flex:1;max-width:1200px}
  .sidebar{width:360px}
      /* ensure video area matches monitor height used across pages */
      .video-wrap{height:var(--monitor-video-height);width:100%;overflow:hidden}
      .monitor-video{width:100%;height:100%;object-fit:cover;display:block}
  .video-card{background:#ffffff;border-radius:10px;box-shadow:0 6px 18px rgba(2,6,23,0.08);overflow:hidden}
  .video-wrap{height:var(--monitor-video-height);width:100%;overflow:hidden}
  .monitor-video{width:100%;height:100%;object-fit:cover;display:block}
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
  constructor(private router: Router, private monitoringSvc: MonitoringService) {}

  onCalibrate() {
    alert('Calibrating...');
  }

  onStart() {
    // start monitoring stats + navigate
    this.monitoringSvc.start();
    this.router.navigate(['/monitoring/active']);
  }
}
