import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { SessionSummary } from '../../services/history.service';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-session-card',
  template: `
    <div
      class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-indigo-600"
        >
          {{ session.id.charAt(0) | uppercase }}
        </div>

        <div class="min-w-0">
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">ID: {{ session.id }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{{ session.date }}</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
          {{ session.duration }}
        </span>

        <button
          type="button"
          (click)="onDetail()"
          class="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Detail
        </button>
      </div>
    </div>
  `,
  styles: [``],
  imports: [
    UpperCasePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionCardComponent {
  @Input() session!: SessionSummary;
  @Output() detailClick = new EventEmitter<string>();

  onDetail() {
    this.detailClick.emit(this.session.id);
  }
}
