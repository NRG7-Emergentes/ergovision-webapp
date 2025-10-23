import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/public/components/footer/footer.component';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import { MonitoringService } from './monitoring.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'monitoring-active',
  imports: [MonitorCamComponent, ZardButtonComponent],
  template: `
    <div class="wrap">
      <div class="main-grid">
        <div class="left">
          <div class="video-large">
            <app-monitor-cam></app-monitor-cam>
          </div>
          <div class="stats-box">
            <div>Good posture Time: <strong>01:24:23</strong></div>
            <div>Active break duration: <strong>00:00:32</strong></div>
          </div>
        </div>
        <div class="right">
          <div class="settings card">
            <h4>Monitoring Settings</h4>
            <div>Visual alert: <input type="checkbox" checked/></div>
            <div>Sound alert: <input type="checkbox"/></div>
            <div class="start-area">
              <button z-button (click)="onPause()" class="btn primary">Start pause</button>
              <button z-button (click)="onEnd()" class="btn destructive">End Monitoring</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  `,
  styles: [`
    .wrap{padding:20px}
    .main-grid{display:flex;gap:20px}
    .left{flex:2}
    .right{flex:1}
    .video-large{height:420px;border-radius:8px;overflow:hidden;background:#000}
    .stats-box{display:flex;gap:10px;margin-top:12px}
    .settings.card{padding:16px;border-radius:8px;background:var(--card)}
    .start-area{display:flex;gap:12px;margin-top:12px}
    .btn.primary{background:var(--primary);color:white}
    .btn.destructive{background:var(--destructive);color:white}
  `]
})
export class ActiveMonitoringComponent {
  constructor(private monitoringSvc: MonitoringService, private router: Router) {}

  onPause() { this.monitoringSvc.pause(); }
  onEnd() { this.monitoringSvc.end(); this.router.navigate(['/monitoring/break']); }
}
