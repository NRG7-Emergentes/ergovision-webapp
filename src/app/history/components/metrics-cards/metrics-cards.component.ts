import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SessionDetail } from '../../services/history.service';

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
  selector: 'app-metrics-cards',
  template: `
    <div *ngIf="(detail || mock).posture" class="row big-cards">
      <div class="big-card">
        <h3>Posture</h3>
        <div>Good: {{ (detail || mock).posture.goodPercent }}%</div>
        <div>Bad: {{ (detail || mock).posture.badPercent }}%</div>
        <div style="margin-top:8px;">Good Time: {{ (detail || mock).posture.goodTime }}</div>
        <div>Bad Time: {{ (detail || mock).posture.badTime }}</div>
      </div>

      <div class="big-card">
        <h3>Pauses</h3>
        <div>Number of Pauses: {{ (detail || mock).pauses.count }}</div>
        <div>Pauses Average Time: {{ (detail || mock).pauses.avgTime }}</div>
      </div>
    </div>
  `,
  styles: [`
    .row { display:flex; gap:16px; }
    .big-card { flex:1; padding:12px; border:1px solid #bbb; border-radius:6px; min-height:120px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsCardsComponent {
  @Input() detail?: SessionDetail;
  readonly mock = MOCK_DETAIL;
}
