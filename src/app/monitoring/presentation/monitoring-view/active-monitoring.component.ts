import { Component, OnInit, OnDestroy } from '@angular/core';
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

      <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="content">
        <main class="main-col">
          <div class="monse-cam-wrap">
            <app-monitor-cam class="monitor-video"></app-monitor-cam>
          </div>
          <div class="card-bottom">
            <div class="note">Live monitoring</div>
            <div class="controls">
              <button z-button (click)="onPause()" class="btn ghost">Pause</button>
              <button z-button (click)="onEnd()" class="btn destructive">End</button>
            </div>
          </div>

          <div class="stats-box">
            <div class="info-card">Good posture Time: <strong>{{ goodTime }}</strong></div>
            <div class="info-card">Active break duration: <strong>{{ totalTime }}</strong></div>
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
    </div>
    
  `,
  styles: [`
  :host { --monitor-video-height: 60vh; display:block }
  /* layout tuned so camera is wider and taller */
  .content{display:flex;gap:20px;padding:12px 20px;align-items:flex-start;width:100%;max-width:100vw;min-height:calc(100vh - 88px)}
  .main-col{flex:1;max-width:2200px;margin-left:20px;display:flex;flex-direction:column}
  /* widen the sidebar so settings take more horizontal space and avoid vertical scroll */
  /* widen the sidebar so settings take more horizontal space and avoid vertical scroll */
  .sidebar{width:480px;flex:0 0 480px;display:flex;flex-direction:column}
  /* use the same minimal camera wrapper as Monse: place app-monitor-cam directly */
  .monse-cam-wrap{width:100%;}
  .monitor-video{width:100%;height:auto;object-fit:cover;display:block}
  .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #eef2f6;background:transparent}
    /* larger UI: buttons, settings */
  .controls .btn{margin-left:12px;padding:20px 28px;border-radius:12px;border:0;cursor:pointer;font-weight:700;font-size:22px}
  .start-area .btn{padding:16px 22px;font-size:18px}
  /* remove forced heights and scrolling inside the settings card so it can expand horizontally; increase typography */
  .settings.card{padding:32px;border-radius:12px;font-size:22px;display:flex;flex-direction:column;justify-content:flex-start;overflow:visible;max-height:none;min-height:auto;width:100%;background:#ffffff}
  .settings.card h4{font-size:24px;margin:0 0 8px}
  .settings.card div{font-size:20px}
  /* make stat/info cards larger */
  .info-card{font-size:20px;padding:20px}
  .monitoring-page, .content { box-sizing: border-box; }
    .stats-box{display:flex;gap:20px;margin-top:18px}
    .card-bottom{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:1px solid #eef2f6}
    .note{color:#6b7280;font-size:13px}
    .btn.primary{background:#2563eb;color:white}
    .btn.success{background:#10b981;color:white}
    .recommendations.card{background:#f8fafc;padding:18px;border-radius:10px}
    .info-row{display:flex;gap:14px;margin-top:14px}
    .info-card{flex:1;background:#f3f4f6;padding:14px;border-radius:8px;text-align:center;font-weight:600}
  .settings.card{padding:16px;border-radius:8px;background:var(--card)}
    .start-area{display:flex;gap:12px;margin-top:12px}
    .btn.destructive{background:var(--destructive);color:white}
  `]
})
export class ActiveMonitoringComponent {
  totalTime = '00:00:00';
  goodTime = '00:00:00';
  private _interval: any;

  constructor(private monitoringSvc: MonitoringService, private router: Router) {}

  ngOnInit(): void {
    this._interval = setInterval(() => this.refreshTimes(), 500);
  }

  ngOnDestroy(): void {
    if (this._interval) clearInterval(this._interval);
  }

  onPause() { this.monitoringSvc.pause(); }
  onEnd() { this.monitoringSvc.end(); this.router.navigate(['/monitoring/break']); }

  private refreshTimes() {
    const s = this.monitoringSvc.getStats();
    this.totalTime = this.msToHms(s.totalMs);
    this.goodTime = this.msToHms(s.goodMs);
  }

  private msToHms(ms: number) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
}
