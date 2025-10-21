import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-chart',
  imports: [],
  template: `
    <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
      <div class="flex flex-col">
        <span class="text-xl font-semibold text-foreground ">Score Progress</span>
        <span class="text-xs text-muted-foreground font-semibold tracking-widest">Last 7 days</span>
      </div>
      <div>
        chart
      </div>
    </div>
  `,
  styles: ``
})
export class ProgressChartComponent {

}
