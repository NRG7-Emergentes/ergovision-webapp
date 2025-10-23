import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService, SessionDetail } from '../../services/history.service';
import { CommonModule, NgIf } from '@angular/common';

const MOCK_DETAIL: SessionDetail = {
  id: 'mock',
  date: '2025-10-20',
  duration: '01:00:00',
  posture: {
    goodPercent: 75,
    badPercent: 25,
    goodTime: '00:45:00',
    badTime: '00:15:00'
  },
  pauses: {
    count: 2,
    avgTime: '00:04:30'
  }
};

@Component({
  selector: 'app-session-page',
  standalone: true,
  imports: [CommonModule, NgIf],
  template: `
    <h2>Session {{ id }}</h2>

    <!-- small cards -->
    <div class="row small-cards">
      <div class="small-card">Date: {{ (session() || mock).date }}</div>
      <div class="small-card">Duration: {{ (session() || mock).duration }}</div>
    </div>

    <!-- metrics: posture & pauses -->
    <div class="row big-cards" *ngIf="(session() || mock).posture">
      <div class="big-card">
        <h3>Posture</h3>
        <div>Good: {{ (session() || mock).posture.goodPercent }}%</div>
        <div>Bad: {{ (session() || mock).posture.badPercent }}%</div>
        <div style="margin-top:8px;">Good Time: {{ (session() || mock).posture.goodTime }}</div>
        <div>Bad Time: {{ (session() || mock).posture.badTime }}</div>
      </div>

      <div class="big-card">
        <h3>Pauses</h3>
        <div>Number of Pauses: {{ (session() || mock).pauses.count }}</div>
        <div>Pauses Average Time: {{ (session() || mock).pauses.avgTime }}</div>
      </div>
    </div>
  `,
  styles: [`
    .row { display:flex; gap:16px; margin-bottom:16px; }
    .small-card { padding:8px; border:1px solid #ccc; border-radius:4px; min-width:140px; }
    .big-cards { align-items:flex-start; }
    .big-card { flex:1; padding:12px; border:1px solid #bbb; border-radius:6px; min-height:120px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionPageComponent implements OnInit {
  id: string | null = null;
  session = signal<SessionDetail | undefined>(undefined);
  readonly mock = MOCK_DETAIL;

  private route = inject(ActivatedRoute);
  private svc = inject(HistoryService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.svc.getSession(this.id).subscribe(s => this.session.set(s));
    }
  }
}
