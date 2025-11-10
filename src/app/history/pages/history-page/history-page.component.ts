import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import {SessionCardComponent} from '@app/history/components/session-card/session-card.component';
import {HistoryService, SessionSummary} from '@app/history/services/history.service';


@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [SessionCardComponent, ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">History</h1>
        <p class="text-muted-foreground mt-2">List of monitored sessions, click Detail to view metrics.</p>
      </div>

      @if (sessions().length > 0) {
        <div class="flex flex-col gap-4">
          @for (session of sessions(); track session.id) {
            <app-session-card [session]="session" (detailClick)="goDetail($event)"/>
          }
        </div>

      } @else {
        <div class="text-sm "> No sessions found. </div>
      }


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
