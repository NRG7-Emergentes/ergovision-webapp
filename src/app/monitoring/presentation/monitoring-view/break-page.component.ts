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
    <div class="bg-background min-h-screen">
      <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="break-panel">
        <h2 class="title">Time for a Break!</h2>
        <p class="subtitle">Try these stretches to avoid back pain</p>
        
        <div class="summary">
          <div class="box bg-muted text-foreground">
            <span class="label">Break Time</span>
            <strong class="value">{{ msToHms(stats.pauseMs) }}</strong>
          </div>
          <div class="box bg-muted text-foreground">
            <span class="label">Breaks Today</span>
            <strong class="value">{{ stats.pauseCount }}</strong>
          </div>
        </div>
        
        <div class="exercises">
          <div class="exercise">
            <img src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop" alt="Neck stretch"/>
            <h5>Neck Stretch</h5>
            <p>Hold for 15-20 seconds</p>
          </div>
          <div class="exercise">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop" alt="Shoulder rolls"/>
            <h5>Shoulder Rolls</h5>
            <p>10 repetitions each side</p>
          </div>
          <div class="exercise">
            <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop" alt="Back extension"/>
            <h5>Back Extension</h5>
            <p>Hold for 10-15 seconds</p>
          </div>
        </div>
        
        <div class="actions">
          <button z-button (click)="onBack()" class="btn primary">Go back to work</button>
        </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
  .break-panel{padding:40px 20px;max-width:1200px;margin:0 auto}
  .title{font-size:32px;font-weight:700;text-align:center;margin:0 0 10px;color:#111827}
  .subtitle{font-size:18px;text-align:center;margin:0 0 40px;color:#6b7280}
  .summary{display:flex;gap:20px;margin-bottom:40px;justify-content:center}
  .box{flex:1;max-width:280px;padding:24px;border-radius:12px;text-align:center;display:flex;flex-direction:column;gap:8px}
  .box .label{font-size:14px;color:#6b7280;font-weight:500}
  .box .value{font-size:28px;font-weight:700;color:#111827}
  .exercises{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-bottom:40px}
  @media (min-width:768px){.exercises{grid-template-columns:repeat(3,1fr)}}
  .exercise{text-align:center;background:#ffffff;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
  .exercise img{width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:12px}
  .exercise h5{margin:0 0 6px;font-size:16px;font-weight:600;color:#111827}
  .exercise p{margin:0;color:#6b7280;font-size:14px}
  .actions{text-align:center}
  .btn{padding:16px 32px;font-size:16px;border-radius:8px;border:0;cursor:pointer;font-weight:600;background:#2563eb;color:white}
  `]
})
export class BreakPageComponent {
  stats = { totalMs: 0, goodMs: 0, badMs: 0, pauseMs: 0, pauseCount: 0 };
  constructor(private monitoringSvc: MonitoringService, private router: Router) {}

  ngOnInit(): void {
    this.stats = this.monitoringSvc.getStats();
  }

  onBack() { this.router.navigate(['/monitoring/start']); }

  // make helper available to the template (used as `msToHms(...)` in template)
  msToHms(ms: number) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }
}
