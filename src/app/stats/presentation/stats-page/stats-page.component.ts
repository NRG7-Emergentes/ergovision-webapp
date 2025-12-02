import {Component, ViewChild, OnInit} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ColumnChartOptions} from '@app/public/components/progress-chart/progress-chart.component';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexDataLabels
} from "ng-apexcharts";
import {Statistics} from '@app/stats/domain/statistics.entity';
import {StatsService} from '@app/stats/services/stats.service';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
};

export type ExtendedColumnChartOptions = ColumnChartOptions & {
  dataLabels?: ApexDataLabels;
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

      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="text-muted-foreground">Loading statistics...</div>
        </div>
      }

      @if (errorMessage && !isLoading) {
        <div class="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
          {{ errorMessage }}
          <button (click)="loadStatistics()" class="ml-4 underline">Retry</button>
        </div>
      }


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
            [dataLabels]="columnScoreChartOptions.dataLabels!"
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
              <span class="text-8xl font-extrabold text-foreground">{{ statistics?.globalAverageScore?.toFixed(2) || '0.00' }}</span>
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
              <span class="text-8xl font-extrabold text-foreground">{{ statistics?.averageSessionTimeMinutes?.toFixed(2) || '0.00' }}</span>
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
                <span class="text-8xl font-extrabold text-foreground">{{ statistics?.averagePausesPerSession?.toFixed(2) || '0.00' }}</span>
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
                <span class="text-8xl font-extrabold text-foreground">{{ statistics?.totalMonitoredHours?.toFixed(2) || '0.00' }}</span>
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
export class StatsPageComponent implements OnInit {
  @ViewChild("columnChart") columnScoreChart: ChartComponent | undefined;
  @ViewChild("pieChart") pieChart: ChartComponent | undefined;

  public columnScoreChartOptions: ExtendedColumnChartOptions;
  public pieChartOptions: PieChartOptions;

  public statistics: Statistics | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(private statsService: StatsService) {

    this.columnScoreChartOptions = this.getDefaultColumnChartOptions();
    this.pieChartOptions = this.getDefaultPieChartOptions();
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.statsService.getStatisticsMe()
      .pipe(
        catchError(error => {
          console.error('Error loading statistics:', error);
          this.errorMessage = error.message || 'Failed to load statistics. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        if (data) {
          this.statistics = data;
          this.updateChartsWithData(data);
        }
      });
  }

  private updateChartsWithData(data: Statistics): void {
    if (data.monthlyProgresses && data.monthlyProgresses.length > 0) {
      const lastFourMonths = data.monthlyProgresses.slice(-4);

      this.columnScoreChartOptions = {
        ...this.columnScoreChartOptions,
        series: [{
          name: "Average Score",
          data: lastFourMonths.map(month => month.averageScore || 0)
        }],
        xaxis: {
          categories: lastFourMonths.map(month => this.formatMonthName(month.month))
        }
      };
    }


    if (data.dailyProgresses && data.dailyProgresses.length > 0) {

      const scoreRanges = this.calculateScoreDistribution(data.dailyProgresses);

      this.pieChartOptions = {
        ...this.pieChartOptions,
        series: scoreRanges.values,
        labels: scoreRanges.labels
      };
    }
  }

  private calculateScoreDistribution(dailyProgresses: any[]): { values: number[], labels: string[] } {

    const ranges = [
      { min: 0, max: 20, label: 'Poor (0-20)' },
      { min: 21, max: 40, label: 'Fair (21-40)' },
      { min: 41, max: 60, label: 'Good (41-60)' },
      { min: 61, max: 80, label: 'Very Good (61-80)' },
      { min: 81, max: 100, label: 'Excellent (81-100)' }
    ];

    const counts = ranges.map(() => 0);

    dailyProgresses.forEach(day => {
      const score = day.averageScore || 0;
      const rangeIndex = ranges.findIndex(range =>
        score >= range.min && score <= range.max
      );
      if (rangeIndex !== -1) {
        counts[rangeIndex]++;
      }
    });

    return {
      values: counts,
      labels: ranges.map(range => range.label)
    };
  }

  private formatMonthName(monthString: string): string {
    if (!monthString) return 'Unknown';

    try {
      const date = new Date(monthString);
      return date.toLocaleDateString('en-US', { month: 'short' });
    } catch {
      // If parsing fails, try to extract month name
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const monthMatch = monthString.match(/\d{4}-(\d{2})/);
      if (monthMatch) {
        const monthIndex = parseInt(monthMatch[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          return monthNames[monthIndex];
        }
      }

      return monthString;
    }
  }

  private getDefaultColumnChartOptions(): ExtendedColumnChartOptions {
    return {
      series: [
        {
          name: "Average Score",
          data: [0, 0, 0, 0]
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
        categories: ["No Data", "No Data", "No Data", "No Data"]
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: function(value: number) {
            return value.toFixed(2) + '%';
          }
        }
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        min: 0,
        max: 100,
        labels: {
          formatter: function(value: number) {
            return value.toFixed(2);
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(value: number) {
          return value.toFixed(2);
        },
        style: {
          colors: ['#FFFFFF']
        }
      }
    };
  }

  private getDefaultPieChartOptions(): PieChartOptions {
    return {
      series: [1],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["No Data"],
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
