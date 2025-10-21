import { Component } from '@angular/core';
import {QuickSummaryComponent} from '@app/public/components/quick-summary/quick-summary.component';
import {StatsSummaryComponent} from '@app/public/components/stats-summary/stats-summary.component';
import {ProgressChartComponent} from '@app/public/components/progress-chart/progress-chart.component';

@Component({
  selector: 'app-main-dashboard',
  imports: [
    QuickSummaryComponent,
    StatsSummaryComponent,
    ProgressChartComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8 ">
      <app-quick-summary/>
      <app-stats-summary/>
      <app-progress-chart/>
    </div>
  `,
  styles: ``
})
export class MainDashboardComponent {

}
