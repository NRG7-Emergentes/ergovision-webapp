import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/public/components/footer/footer.component';
import { MonitoringService } from './monitoring.service';
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
          <div class="box">Break Time<br/><strong>00:05:55</strong></div>
          <div class="box">You took 2 breaks today</div>
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
    .break-wrap{padding:24px;display:flex;justify-content:center}
    .break-panel{width:900px;background:var(--card);padding:20px;border-radius:8px}
    .summary{display:flex;gap:12px}
    .box{flex:1;background:#e9ecef;padding:12px;border-radius:8px;text-align:center}
    .exercises{display:flex;gap:12px;margin-top:12px}
    .exercise img{width:180px;height:100px;object-fit:cover;border-radius:8px}
    .actions{margin-top:16px;text-align:center}
    .btn.primary{background:var(--primary);color:white}
  `]
})
export class BreakPageComponent {
  constructor(private monitoringSvc: MonitoringService, private router: Router) {}
  onBack() { this.router.navigate(['/monitoring/start']); }
}
