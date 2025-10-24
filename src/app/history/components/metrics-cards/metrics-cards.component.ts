import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SessionDetail } from '../../services/history.service';

const MOCK_DETAIL: SessionDetail = {
  id: 'mock',
  date: '2025-10-20',
  duration: '01:00:00',
  posture: { goodPercent: 75, badPercent: 25, goodTime: '00:45:00', badTime: '00:15:00' },
  pauses: { count: 2, avgTime: '00:04:30' }
};

@Component({
  selector: 'app-metrics-cards',
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Posture</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total: {{ (detail || mock).duration }}</span>
        </div>

        <div class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">Good</span>
              <span class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ (detail || mock).posture.goodPercent }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div
                class="h-2 bg-green-500"
                [style.width.%]="(detail || mock).posture.goodPercent"
              ></div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">Time: <span class="font-medium">{{ (detail || mock).posture.goodTime }}</span></div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600 dark:text-gray-300">Bad</span>
              <span class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ (detail || mock).posture.badPercent }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div
                class="h-2 bg-red-500"
                [style.width.%]="(detail || mock).posture.badPercent"
              ></div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">Time: <span class="font-medium">{{ (detail || mock).posture.badTime }}</span></div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Pauses</h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">Session</span>
        </div>

        <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div class="flex items-center justify-between">
            <span>Number of Pauses</span>
            <span class="font-medium">{{ (detail || mock).pauses.count }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span>Pauses Average Time</span>
            <span class="font-medium">{{ (detail || mock).pauses.avgTime }}</span>
          </div>

          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Note: pauses are detected when inactivity > threshold.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsCardsComponent {
  @Input() detail?: SessionDetail;
  readonly mock = MOCK_DETAIL;
}
