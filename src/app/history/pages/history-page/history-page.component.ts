import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import {SessionCardComponent} from '@app/history/components/session-card/session-card.component';
import {HistoryService} from '@app/history/services/history.service';
import {SessionSummary} from '@app/history/models/session.model';
import {toast} from 'ngx-sonner';


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

      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="text-muted-foreground">Loading sessions...</div>
        </div>
      } @else if (sessions().length > 0) {
        <div class="flex flex-col gap-4">
          @for (session of sessions(); track session.id) {
            <app-session-card [session]="session" (detailClick)="goDetail($event)"/>
          }
        </div>
      } @else {
        <div class="text-sm text-muted-foreground"> No sessions found. Start a monitoring session to see it here! </div>
      }
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPageComponent implements OnInit {
  sessions = signal<SessionSummary[]>([]);
  isLoading = signal<boolean>(true);
  private svc = inject(HistoryService);
  private router = inject(Router);

  ngOnInit(): void {
    console.log('=== HISTORY PAGE - Loading Sessions ===');
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading.set(true);
    console.log('Making GET request to fetch sessions...');
    
    this.svc.listSessions().subscribe({
      next: (list) => {
        console.log('✅ Sessions loaded successfully:', list);
        this.sessions.set(list);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading sessions:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        let errorMessage = 'Failed to load sessions';
        if (error.status === 0) {
          errorMessage = 'Cannot connect to backend. Is the server running?';
        } else if (error.status === 404) {
          errorMessage = 'Sessions endpoint not found';
        }
        
        toast.error(errorMessage);
        this.isLoading.set(false);
        this.sessions.set([]);
      }
    });
  }

  goDetail(id: string) {
    this.router.navigate(['history', id]);
  }
}
