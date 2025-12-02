import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis
} from "ng-apexcharts";
import {Statistics} from '@app/stats/domain/statistics.entity';
import {of, Subject, takeUntil} from 'rxjs';
import {StatsService} from '@app/stats/services/stats.service';
import {catchError, finalize} from 'rxjs/operators';

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  yaxis: ApexYAxis;
};




@Component({
  selector: 'app-progress-chart',
  imports: [
    ChartComponent
  ],
  template: `
    <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
      <div class="flex flex-col mb-4">
        <span class="text-xl font-semibold text-foreground ">Score Progress</span>
        <span class="text-xs text-muted-foreground font-medium tracking-widest">Last 7 days</span>
      </div>

      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="text-muted-foreground">Loading progress data...</div>
        </div>
      }

      @if (errorMessage && !isLoading) {
        <div class="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4 text-sm">
          {{ errorMessage }}
        </div>
      }

      @if (!isLoading && !errorMessage) {
        <div class="">
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

        @if (weeklyStats) {
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Average</span>
              <span class="text-2xl font-bold text-foreground">{{ weeklyStats.averageScore.toFixed(1) }}%</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Best</span>
              <span class="text-2xl font-bold text-emerald-400">{{ weeklyStats.bestScore.toFixed(1) }}%</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">Trend</span>
              <div class="flex items-center gap-2">
                @if (weeklyStats.trend === 'up') {
                  <i class="icon-trending-up text-emerald-400"></i>
                  <span class="text-2xl font-bold text-emerald-400">+{{ weeklyStats.trendChange.toFixed(1) }}%</span>
                } @else if (weeklyStats.trend === 'down') {
                  <i class="icon-trending-down text-destructive"></i>
                  <span class="text-2xl font-bold text-destructive">{{ weeklyStats.trendChange.toFixed(1) }}%</span>
                } @else {
                  <i class="icon-minus text-amber-400"></i>
                  <span class="text-2xl font-bold text-amber-400">Stable</span>
                }
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: ``
})
export class ProgressChartComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent | undefined;

  public chartOptions: ColumnChartOptions;
  public statistics: Statistics | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  // Estadísticas semanales calculadas
  public weeklyStats: {
    averageScore: number;
    bestScore: number;
    worstScore: number;
    trend: 'up' | 'down' | 'stable';
    trendChange: number;
  } | null = null;

  private destroy$ = new Subject<void>();

  constructor(private statsService: StatsService) {
    this.chartOptions = this.getDefaultChartOptions();
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.weeklyStats = null;

    this.statsService.getStatisticsMe()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading statistics:', error);
          this.errorMessage = error.message || 'Failed to load progress data. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(data => {
        if (data) {
          this.statistics = data;
          this.updateChartWithData(data);
        }
      });
  }

  private updateChartWithData(data: Statistics): void {
    if (!data.dailyProgresses || data.dailyProgresses.length === 0) {
      // Si no hay datos, mostrar gráfico vacío
      this.chartOptions = {
        ...this.chartOptions,
        series: [{
          name: "Average Score",
          data: [0, 0, 0, 0, 0, 0, 0]
        }],
        xaxis: {
          categories: ["No Data", "No Data", "No Data", "No Data", "No Data", "No Data", "No Data"]
        }
      };
      return;
    }

    // Ordenar progresos diarios por fecha
    const sortedDailyProgress = [...data.dailyProgresses]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Tomar los últimos 7 días
    const last7Days = sortedDailyProgress.slice(-7);

    // Preparar datos para el gráfico
    const chartData = last7Days.map(day => day.averageScore || 0);
    const dayNames = last7Days.map(day => this.getDayName(day.date));

    // Calcular estadísticas semanales
    this.calculateWeeklyStats(chartData);

    // Actualizar opciones del gráfico
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: "Average Score",
        data: chartData
      }],
      xaxis: {
        categories: dayNames,
        labels: {
          style: {
            colors: '#FFFFFF'
          }
        }
      },
      yaxis: {
        ...this.chartOptions.yaxis,
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: '#FFFFFF'
          },
          formatter: (value) => `${Math.round(value)}%`
        }
      },
      tooltip: {
        ...this.chartOptions.tooltip,
        y: {
          formatter: (value) => `${value.toFixed(1)}%`
        }
      }
    };
  }

  private calculateWeeklyStats(scores: number[]): void {
    if (scores.length === 0) {
      this.weeklyStats = {
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        trend: 'stable',
        trendChange: 0
      };
      return;
    }

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    // Calcular tendencia (comparar primera mitad vs segunda mitad de la semana)
    const midPoint = Math.floor(scores.length / 2);
    const firstHalfAvg = scores.slice(0, midPoint).reduce((sum, score) => sum + score, 0) / midPoint;
    const secondHalfAvg = scores.slice(midPoint).reduce((sum, score) => sum + score, 0) / (scores.length - midPoint);

    const trendChange = secondHalfAvg - firstHalfAvg;
    let trend: 'up' | 'down' | 'stable' = 'stable';

    if (trendChange > 2) trend = 'up';
    else if (trendChange < -2) trend = 'down';

    this.weeklyStats = {
      averageScore,
      bestScore,
      worstScore,
      trend,
      trendChange
    };
  }

  private getDayName(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      // Si hay error en el formato, devolver día genérico
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const randomIndex = Math.floor(Math.random() * days.length);
      return days[randomIndex];
    }
  }

  private getDefaultChartOptions(): ColumnChartOptions {
    return {
      series: [
        {
          name: "Average Score",
          data: [0, 0, 0, 0, 0, 0, 0]
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
          borderRadiusApplication: 'end',
          colors: {
            ranges: [{
              from: 0,
              to: 100,
              color: '#3B82F6' // Color azul para las barras
            }]
          }
        }
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        labels: {
          style: {
            colors: '#FFFFFF'
          }
        }
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: (value) => `${value.toFixed(1)}%`
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
          show: true,
          color: '#374151'
        },
        axisTicks: {
          show: true,
          color: '#374151'
        },
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: '#FFFFFF'
          },
          formatter: (value) => `${Math.round(value)}%`
        }
      }
    };
  }
}
