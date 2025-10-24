import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService, SessionDetail } from '../../services/history.service';
import {MetricsCardsComponent} from '@app/history/components/metrics-cards/metrics-cards.component';

@Component({
  selector: 'app-session-page',
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Session {{ id }}</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">Overview</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-100 font-semibold">D</div>
            <div>
              <div class="text-xs text-gray-500">Date</div>
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ (session() || mock).date }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-500">Recorded at local timezone</div>
        </div>

        <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex flex-col">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-100 font-semibold">T</div>
            <div>
              <div class="text-xs text-gray-500">Duration</div>
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ (session() || mock).duration }}</div>
            </div>
          </div>
          <div class="text-xs text-gray-500">HH:MM:SS</div>
        </div>
      </div>

      <app-metrics-cards [detail]="session()"></app-metrics-cards>
    </div>
  `,
  styles: [``],
  imports: [
    MetricsCardsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionPageComponent implements OnInit {
  id: string | null = null;
  session = signal<SessionDetail | undefined>(undefined);

  // reuse same mock as MetricsCards fallback if needed (kept internal only)
  readonly mock: SessionDetail = {
    id: 'mock',
    date: '2025-10-20',
    duration: '01:00:00',
    posture: { goodPercent: 75, badPercent: 25, goodTime: '00:45:00', badTime: '00:15:00' },
    pauses: { count: 2, avgTime: '00:04:30' }
  };

  private route = inject(ActivatedRoute);
  private svc = inject(HistoryService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.svc.getSession(this.id).subscribe(s => this.session.set(s));
    }
  }
}
