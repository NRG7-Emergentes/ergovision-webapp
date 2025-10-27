import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { SessionSummary } from '../../services/history.service';
import {UpperCasePipe} from '@angular/common';
import {ZardButtonComponent} from '@shared/components/button/button.component';

@Component({
  selector: 'app-session-card',
  template: `
    <div class="bg-card border p-6 rounded-lg shadow-sm text-card-foreground w-full flex items-center justify-between">
      <div class="flex items-center gap-16">
        <span class="text-xl font-bold">Session ID: {{ session.id }}</span>
        <span class="text-xl text-muted-foreground"> {{session.date}} </span>
        <div class="rounded-full bg-muted text-muted-foreground px-4 py-2 ">
          <span class="text-md"> {{session.duration}}</span>
        </div>
      </div>
      <button z-button zType="default" zSize="lg" (click)="onDetail()">
        View More
        <div class="aspect-square flex justify-center items-center">
          <i class="icon-chevron-right text-white  "></i>
        </div>
      </button>
    </div>
  `,
  styles: [``],
  imports: [
    ZardButtonComponent
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
