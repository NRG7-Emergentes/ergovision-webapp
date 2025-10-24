import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/public/components/footer/footer.component';
import { MonitoringService } from '@app/monitoring/presentation/monitoring-view/monitoring.service';
import { ZardButtonComponent } from '../../../shared/components/button/button.component';

function msToHms(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

@Component({
  selector: 'monitoring-break',
  imports: [ZardButtonComponent],
  template: `
    <div class="break-wrap">
      <div class="break-panel">
        <div class="summary">
          <div class="box">Break Time<br/><strong>{{ msToHms(stats.pauseMs) }}</strong></div>
          <div class="box">You took {{ stats.pauseCount }} breaks today</div>
        </div>
        <div class="exercises">
          <div class="exercise"> <img src="/assets/ex1.jpg"/> </div>
          <div class="exercise"> <img src="/assets/ex2.jpg"/> </div>
          <div class="exercise"> <img src="/assets/ex3.jpg"/> </div>
        </div>
        <div class="actions">
          <button z-button (click)="onBack()" class="btn primary">Go back to work</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
  .break-wrap{padding:12px;display:flex;justify-content:center;min-height:calc(100vh - 88px)}
  .break-panel{width:1400px;max-width:95vw;background:var(--card);padding:36px;border-radius:12px;max-height:calc(100vh - 120px);overflow:auto}
  .summary{display:flex;gap:22px}
  .box{flex:1;background:#e9ecef;padding:28px;border-radius:12px;text-align:center;font-size:18px;max-height:50vh;overflow:auto}
  .exercises{display:flex;gap:20px;margin-top:26px}
  .exercise img{width:340px;height:190px;object-fit:cover;border-radius:12px}
  .actions{margin-top:26px;text-align:center}
  .btn.primary{background:var(--primary);color:white;padding:20px 26px;font-size:20px;border-radius:12px}
  `]
})
export class BreakPageComponent {
  stats = { totalMs: 0, goodMs: 0, badMs: 0, pauseMs: 0, pauseCount: 0 };
  constructor(private monitoringSvc: MonitoringService, private router: Router) {}

  ngOnInit(): void {
    this.stats = this.monitoringSvc.getStats();
  }

  onBack() { this.router.navigate(['/monitoring/start']); }
}
