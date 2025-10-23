import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { SessionSummary } from '../../services/history.service';

@Component({
  selector: 'app-session-card',
  template: `
    <div class="card">
      <div class="left">
        <div class="id">ID: {{ session.id }}</div>
        <div class="meta">{{ session.date }} • {{ session.duration }}</div>
      </div>
      <div class="right">
        <button type="button" aria-label="View session details" (click)="onDetail()">Detail</button>
      </div>
    </div>
  `,
  styles: [`
    .card { display:flex; justify-content:space-between; align-items:center; padding:8px; border:1px solid #ddd; border-radius:4px; }
    .left { display:flex; flex-direction:column; }
    .id { font-weight:600; }
    .meta { color:#666; font-size:0.9em; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionCardComponent {
  @Input() session!: SessionSummary;
  @Output() detailClick = new EventEmitter<string>();

  onDetail() {
    // only emit id; navigation handled by parent (HistoryPageComponent)
    this.detailClick.emit(this.session.id);
  }
}
