import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService, SessionSummary } from '../../services/history.service';
import { SessionCardComponent } from '../../components/session-card/session-card.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SessionCardComponent, NgForOf, NgIf],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4">
      <header class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">History</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">List of monitored sessions — click Detail to view metrics.</p>
      </header>

      <div *ngIf="sessions().length === 0" class="text-sm text-gray-500">No sessions found.</div>

      <div class="space-y-3">
        <app-session-card
          *ngFor="let s of sessions()"
          [session]="s"
          (detailClick)="goDetail($event)"
        ></app-session-card>
      </div>
    </div>
  `,
  styles: [``],
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
