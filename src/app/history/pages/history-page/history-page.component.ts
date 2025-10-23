import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService, SessionSummary } from '../../services/history.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { StatsSummaryComponent } from '@app/public/components/stats-summary/stats-summary.component';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, StatsSummaryComponent],
  template: `

    <h2>History</h2>
    <div *ngIf="sessions().length === 0">No sessions found.</div>

    <ul class="list">
      <li *ngFor="let s of sessions()">
        <div class="card-row">
          <div class="left">
            <div class="id">ID: {{ s.id }}</div>
            <div class="meta">{{ s.date }} • {{ s.duration }}</div>
          </div>
          <div class="right">
            <button type="button" (click)="goDetail(s.id)">Detail</button>
          </div>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card-row { display:flex; justify-content:space-between; align-items:center; padding:8px; border:1px solid #ddd; border-radius:4px; }
    .left { display:flex; flex-direction:column; }
    .id { font-weight:600; }
    .meta { color:#666; font-size:0.9em; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPageComponent implements OnInit {
  sessions = signal<SessionSummary[]>([]);
  private svc = inject(HistoryService);
  private router = inject(Router);

  ngOnInit(): void {
    this.svc.listSessions().subscribe(list => this.sessions.set(list));
  }

  goDetail(id: string) {
    this.router.navigate(['history', id]);
  }
}
