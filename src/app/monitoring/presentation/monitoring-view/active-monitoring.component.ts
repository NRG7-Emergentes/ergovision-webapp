import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/public/components/footer/footer.component';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import { MonitoringService } from '@app/monitoring/presentation/monitoring-view/monitoring.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'monitoring-active',
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
              <div class="note">Live monitoring</div>
              <div class="controls">
                <button z-button (click)="onPause()" class="btn ghost">Pause</button>
                <button z-button (click)="onEnd()" class="btn destructive">End</button>
              </div>
            </div>
          </div>

          <div class="stats-box">
            <div class="info-card">Good posture Time: <strong>01:24:23</strong></div>
            <div class="info-card">Active break duration: <strong>00:00:32</strong></div>
          </div>
        </main>

        <aside class="sidebar">
          <div class="settings card">
            <h4>Monitoring Settings</h4>
            <div>Visual alert: <input type="checkbox" checked/></div>
            <div>Sound alert: <input type="checkbox"/></div>
            <div class="start-area">
              <button z-button (click)="onPause()" class="btn primary">Start pause</button>
              <button z-button (click)="onEnd()" class="btn destructive">End Monitoring</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
    
  `,
  styles: [`
    :host { --monitor-video-height: 70vh; display:block }
    .content{display:flex;gap:24px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw}
    .main-col{flex:1;max-width:1200px}
    .sidebar{width:360px}
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
    .stats-box{display:flex;gap:14px;margin-top:14px}
    .settings.card{padding:16px;border-radius:8px;background:var(--card)}
    .start-area{display:flex;gap:12px;margin-top:12px}
    .btn.destructive{background:var(--destructive);color:white}
  `]
})
export class ActiveMonitoringComponent {
  constructor(private monitoringSvc: MonitoringService, private router: Router) {}

  onPause() { this.monitoringSvc.pause(); }
  onEnd() { this.monitoringSvc.end(); this.router.navigate(['/monitoring/break']); }
}
