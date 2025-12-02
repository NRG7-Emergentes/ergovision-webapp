
import {Component, OnInit, inject} from '@angular/core';
import {Statistics} from '@app/stats/domain/statistics.entity';
import {StatsService} from '@app/stats/services/stats.service';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-stats-summary',
  imports: [],
  template: `
    <div class="mb-8">
      <p class="text-lg font-bold text-foreground mb-4 tracking-tight">Statistics Summary</p>

      @if (isLoading) {
        <div class="flex justify-center items-center py-8">
          <div class="text-muted-foreground">Loading statistics...</div>
        </div>
      }

      @if (errorMessage && !isLoading) {
        <div class="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
          {{ errorMessage }}
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                last 7 days
              </span>
              <span class="text-sm font-semibold text-foreground ">Average Score</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-chart-bar-big text-primary  "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">{{ getLast7DaysAverageScore().toFixed(2) }}</span>
            <span class="text-sm text-muted-foreground font-medium">%</span>
          </div>
          <p class="text-xs text-muted-foreground mt-2">{{ getScoreTrendMessage() }}</p>
        </div>



        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                this week
              </span>
              <span class="text-sm font-semibold text-foreground">Total Monitored Time</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-cyan-500/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-clock text-cyan-400 "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">{{ getWeeklyMonitoredTime() }}</span>
          </div>
        </div>


        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                main focus
              </span>
              <span class="text-sm font-semibold text-foreground ">Most Common Weak Point</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-amber-500/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-triangle-alert text-amber-400  "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">{{ getMostCommonWeakPoint() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StatsSummaryComponent implements OnInit {
  private statsService = inject(StatsService);

  public statistics: Statistics | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';


  private weakPointsData = [
    { name: 'Shoulder', count: 8 },
    { name: 'Back', count: 5 },
    { name: 'Neck', count: 3 },
    { name: 'Posture', count: 6 },
    { name: 'Breathing', count: 2 }
  ];


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
        }
      });
  }

  getLast7DaysAverageScore(): number {
    if (!this.statistics || !this.statistics.dailyProgresses) {
      return 0;
    }


    const last7Days = this.statistics.dailyProgresses.slice(-7);

    if (last7Days.length === 0) {
      return this.statistics.globalAverageScore || 0;
    }


    const sum = last7Days.reduce((total, day) => total + (day.averageScore || 0), 0);
    return sum / last7Days.length;
  }

  getScoreTrendMessage(): string {
    const score = this.getLast7DaysAverageScore();

    if (score >= 80) return 'Excellent progress! Keep it up!';
    if (score >= 60) return 'Good work! Slight improvement from last week.';
    if (score >= 40) return 'Steady progress. Room for improvement.';
    return 'Focus on consistency. You can improve!';
  }

  getWeeklyMonitoredTime(): string {
    if (!this.statistics) {
      return '0h 0m';
    }

    const totalHours = this.statistics.totalMonitoredHours || 0;
    const weeklyHours = totalHours / 4.3;

    const hours = Math.floor(weeklyHours);
    const minutes = Math.round((weeklyHours - hours) * 60);

    return `${hours}h ${minutes}m`;
  }


  getMostCommonWeakPoint(): string {
    if (this.weakPointsData.length === 0) {
      return 'Posture';
    }

    const mostCommon = this.weakPointsData.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );

    return mostCommon.name;
  }
}
