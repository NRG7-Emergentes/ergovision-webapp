import {Component, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ColumnChartOptions} from '@app/public/components/progress-chart/progress-chart.component';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};

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
        <div class="col-start-1 row-start-1 col-span-2 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <p class="text-xl font-semibold text-foreground ">Score Progress - Last 4 Months</p>
          <p class="text-xs text-muted-foreground font-medium">Your posture score trend over time</p>
          <apx-chart
            [series]="columnScoreChartOptions.series"
            [chart]="columnScoreChartOptions.chart"
            [xaxis]="columnScoreChartOptions.xaxis"
            [plotOptions]="columnScoreChartOptions.plotOptions"
            [tooltip]="columnScoreChartOptions.tooltip"
            [grid]="columnScoreChartOptions.grid"
            [yaxis]="columnScoreChartOptions.yaxis"
          ></apx-chart>
        </div>
        <div class="col-start-1 row-start-2 col-span-3 md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-2 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <p class="text-xl font-semibold text-foreground ">Posture Quality Distribution</p>
          <p class="text-xs text-muted-foreground font-medium">Breakdown of your posture quality levels</p>
          <div class="flex justify-center items-center h-full">
            <apx-chart
              [series]="pieChartOptions.series"
              [chart]="pieChartOptions.chart"
              [labels]="pieChartOptions.labels"
              [responsive]="pieChartOptions.responsive"
              [legend]="pieChartOptions.legend"
            ></apx-chart>
          </div>
        </div>
        <div class="col-start-3 row-start-1 md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-between ">
              <span class="text-xl text-muted-foreground font-medium tracking-widest">All Time Average Score</span>
              <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10">
                <div class="aspect-square w-5 h-5 flex justify-center items-center">
                  <i class="icon-chart-column text-primary  "></i>
                </div>
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-8xl font-extrabold text-foreground">78.5</span>
              <span class="text-2xl text-muted-foreground font-medium">%</span>
            </div>
            <div class="flex-1 ">
              <p class="text-xs text-muted-foreground font-medium ">Your overall posture quality score</p>
            </div>
          </div>
        </div>
        <div class="col-start-1 row-start-3 md:col-start-2 md:row-start-2 md:col-span-1 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-between ">
              <span class="text-xl text-muted-foreground font-medium tracking-widest">Avg Session Time</span>
              <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10">
                <div class="aspect-square w-5 h-5 flex justify-center items-center">
                  <i class="icon-clock text-primary  "></i>
                </div>
              </div>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-8xl font-extrabold text-foreground">45</span>
              <span class="text-2xl text-muted-foreground font-medium">min</span>
            </div>
            <div class="flex-1 ">
              <p class="text-xs text-muted-foreground font-medium ">Average monitoring duration</p>
            </div>
          </div>
        </div>


        <div class="col-start-1 row-start-3 col-span-3 md:col-start-1 md:row-start-3 md:col-span-3 md:row-span-1 bg-card block border p-6 rounded-lg shadow-sm text-card-foreground">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col h-full border-r px-6">
              <div class="flex items-center justify-between ">
                <span class="text-xl text-muted-foreground font-medium tracking-widest">Avg Active Pauses</span>
                <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10">
                  <div class="aspect-square w-5 h-5 flex justify-center items-center">
                    <i class="icon-zap text-primary  "></i>
                  </div>
                </div>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-8xl font-extrabold text-foreground">3.2</span>
                <span class="text-2xl text-muted-foreground font-medium">per session</span>
              </div>
              <div class="flex-1 ">
                <p class="text-xs text-muted-foreground font-medium ">Rest breaks per monitoring session</p>
              </div>
            </div>

            <div class="flex flex-col h-full px-6">
              <div class="flex items-center justify-between ">
                <span class="text-xl text-muted-foreground font-medium tracking-widest">Total Time Monitored</span>
                <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10">
                  <div class="aspect-square w-5 h-5 flex justify-center items-center">
                    <i class="icon-chart-column text-primary  "></i>
                  </div>
                </div>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-8xl font-extrabold text-foreground">12</span>
                <span class="text-2xl text-muted-foreground font-medium"> h</span>
              </div>
              <div class="flex-1 ">
                <p class="text-xs text-muted-foreground font-medium ">Your total time you have monitored your posture</p>
              </div>
            </div>


          </div>
        </div>

      </div>
    </div>
  `,
  styles: ``
})
export class StatsPageComponent {

  @ViewChild("chart") columnScoreChart: ChartComponent | undefined;
  public columnScoreChartOptions: ColumnChartOptions;

  @ViewChild("chart") pieChart: ChartComponent | undefined;
  public pieChartOptions: PieChartOptions;


  constructor() {
    this.columnScoreChartOptions = {
      series: [
        {
          name: "score",
          data: [10, 41, 35, 51]
        }
      ],
      chart: {
        height: 300,
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
        categories: ["May", "June",  "July",  "August"]
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

    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      legend: {
        labels: {
          colors: '#FFFFFF'
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
