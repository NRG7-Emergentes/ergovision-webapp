import {Component, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ColumnChartOptions} from '@app/public/components/progress-chart/progress-chart.component';

@Component({
  selector: 'app-stats-page',
  imports: [
    ChartComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Progress Analytics</h1>
        <p class="text-muted-foreground mt-2">Track your posture monitoring insights and improvements</p>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-3 grid-rows-3 md:grid-rows-3 gap-2 md:gap-2 ">
        <div class="col-start-1 row-start-1 row-span-2 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [plotOptions]="chartOptions.plotOptions"
            [tooltip]="chartOptions.tooltip"
            [grid]="chartOptions.grid"
            [yaxis]="chartOptions.yaxis"
          ></apx-chart>
        </div>
        <div class="col-start-3 row-start-1 row-span-2 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-2 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">1</div>
        <div class="col-start-2 row-start-1 md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">2</div>
        <div class="col-start-2 row-start-2 md:col-start-2 md:row-start-2 md:col-span-1 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">3</div>
        <div class="col-start-1 row-start-3 col-span-2 md:col-start-1 md:row-start-3 md:col-span-2 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">4</div>
        <div class="col-start-3 row-start-3 md:col-start-3 md:row-start-3 md:col-span-1 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">5</div>

      </div>
    </div>
  `,
  styles: ``
})
export class StatsPageComponent {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: ColumnChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "score",
          data: [10, 41, 35, 51, 49, 62, 69]
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        foreColor: "#FFFFFF",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          borderRadiusApplication: 'end'
        }
      },
      xaxis: {
        categories: ["Mon", "Tue",  "Wed",  "Thu",  "Fri",  "Sat",  "Sun"]
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      yaxis: { // <-- Add this object
        axisBorder: {
          show: true // This shows the main vertical Y-axis line
        },
        axisTicks: {
          show: true // This shows the small tick marks next to the numbers
        }
      }
    };
  }
}
