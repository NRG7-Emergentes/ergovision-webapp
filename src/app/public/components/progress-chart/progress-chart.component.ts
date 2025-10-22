import { Component ,ViewChild} from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};



@Component({
  selector: 'app-progress-chart',
  imports: [
    ChartComponent
  ],
  template: `
    <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
      <div class="flex flex-col">
        <span class="text-xl font-semibold text-foreground ">Score Progress</span>
        <span class="text-xs text-muted-foreground font-semibold tracking-widest">Last 7 days</span>
      </div>
      <div class="">
        <apx-chart
          [series]="chartOptions.series"
          [chart]="chartOptions.chart"
          [xaxis]="chartOptions.xaxis"
          [plotOptions]="chartOptions.plotOptions"
          [tooltip]="chartOptions.tooltip"
        ></apx-chart>
      </div>
    </div>
  `,
  styles: ``
})
export class ProgressChartComponent {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: ChartOptions;

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
      }
    };
  }
}
