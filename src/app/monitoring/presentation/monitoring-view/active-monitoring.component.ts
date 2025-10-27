import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/public/components/footer/footer.component';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';
import { MonitoringService } from '@app/monitoring/presentation/monitoring-view/monitoring.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'monitoring-active',
  imports: [MonitorCamComponent, ZardButtonComponent, FormsModule],
  template: `
    <div class="bg-background min-h-screen">
      <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="content">
        <main class="main-col">
          <div class="monse-cam-wrap">
            <app-monitor-cam class="monitor-video" [detectionInterval]="inferenceSpeed"></app-monitor-cam>
          </div>
          <div class="card-bottom bg-card border-t border-border">
            <div class="note text-foreground">Live monitoring</div>
            <div class="controls">
              <button z-button (click)="onPause()" class="btn primary">Pause</button>
              <button z-button (click)="onEnd()" class="btn destructive">End</button>
            </div>
          </div>

          <div class="stats-box">
            <div class="info-card bg-muted text-foreground">Good posture Time: <strong>{{ goodTime }}</strong></div>
            <div class="info-card bg-muted text-foreground">Active break duration: <strong>{{ totalTime }}</strong></div>
          </div>
  </main>

  <aside class="sidebar">
          <div class="settings card bg-card text-card-foreground border border-border">
            <h4 class="text-foreground">Monitoring Settings</h4>
            
            <div class="setting-row">
              <span class="setting-label">Visual alert</span>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="visualAlert"/>
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <span class="setting-label">Sounds alert</span>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="soundsAlert"/>
                <span class="slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <span class="setting-label">Inference speed</span>
              <select [(ngModel)]="inferenceSpeed" class="inference-select">
                <option value="1">1/1 frames (every frame)</option>
                <option value="5">1/5 frames</option>
                <option value="10">1/10 frames</option>
                <option value="20">1/20 frames</option>
                <option value="30">1/30 frames</option>
              </select>
            </div>

            <div class="time-info">
              <div class="time-row">
                <span>Last break was:</span>
                <strong>{{ lastBreakTime }}</strong>
              </div>
              <div class="time-row">
                <span>Next active break in:</span>
                <strong>{{ nextBreakTime }}</strong>
              </div>
            </div>

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
  .btn.destructive{background:var(--destructive);color:white}
  .settings.card{padding:28px;border-radius:12px;font-size:18px;display:flex;flex-direction:column;width:100%;background:#ffffff}
  .settings.card h4{font-size:20px;margin:0 0 20px;font-weight:600;color:#111827}
  .setting-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
  .setting-label{font-size:16px;color:#374151}
  .switch{position:relative;display:block;width:48px;height:26px;flex-shrink:0}
  .switch input{position:absolute;opacity:0;width:0;height:0}
  .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#d1d5db;border-radius:26px;transition:background-color 0.3s}
  .slider:before{position:absolute;content:"";height:20px;width:20px;left:3px;bottom:3px;background-color:white;border-radius:50%;transition:transform 0.3s}
  input:checked + .slider{background-color:#3b82f6}
  input:checked + .slider:before{transform:translateX(22px)}
  .time-info{margin:20px 0;padding:16px 0;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb}
  .time-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:15px}
  .time-row:last-child{margin-bottom:0}
  .time-row span{color:#6b7280}
  .time-row strong{color:#111827;font-weight:600}
  .inference-select{width:auto;min-width:180px;padding:6px 32px 6px 12px;font-size:14px;color:#374151;background-color:#f9fafb;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center}
  .inference-select:hover{background-color:#f3f4f6;border-color:#9ca3af}
  .inference-select:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1)}
  .start-area{display:flex;flex-direction:column;gap:12px;margin-top:20px}
  .start-area .btn{width:100%;padding:14px 20px;font-size:16px;border-radius:8px;font-weight:600}
  .info-card{font-size:18px;padding:18px;border-radius:10px;background:#f3f4f6;text-align:center;color:#111827}
  .info-card strong{color:#111827}
  .stats-box{display:flex;gap:20px;margin-top:18px}
  `]
})
export class ActiveMonitoringComponent {
  totalTime = '00:00:00';
  goodTime = '00:00:00';
  lastBreakTime = '00:54:03';
  nextBreakTime = '00:25:00';
  
  // Switch states
  visualAlert = true;
  soundsAlert = false;
  inferenceSpeed = 10; // Default 1/10 frames
  
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
