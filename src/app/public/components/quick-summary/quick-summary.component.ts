import {Component, inject, OnInit} from '@angular/core';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';
import {User} from '@app/iam/domain/model/user.entity';
import {forkJoin, of} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {Statistics} from '@app/stats/domain/statistics.entity';
import {UserService} from '@app/iam/services/user.service';
import {StatsService} from '@app/stats/services/stats.service';

@Component({
  selector: 'app-quick-summary',
  imports: [
    ZardButtonComponent
  ],
  template: `
    <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full mb-8">
      <div class="flex justify-between items-center">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8 flex-1">
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium"> welcome </span>
            <span class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight"> Hello, {{ getUserName() }}! </span>
          </div>
          <div class="flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-background/50 border border-border">
            <span class="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium"> last session </span>
            <span class="text-4xl font-bold text-primary">{{ getLastSessionScore() }}%</span>
          </div>

          <div class="flex flex-col justify-center gap-4">
            <div class="flex items-center gap-2">
              <i [class]="getImprovementIcon() + ' mr-1 w-5 h-5'"></i>
              <span class="text-sm font-semibold text-foreground">{{ getImprovementStatus() }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl" aria-hidden="true">
                🔥
              </span>
              <div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest font-medium">Current Streak</p>
                <p class="text-lg font-bold text-foreground">{{ getCurrentStreak() }} days</p>
              </div>
            </div>
          </div>

        </div>
        <button z-button zType="default" zSize="lg" (click)="goToMonitoring()">
          <i class="icon-play ml-1"></i>
          Start Monitoring
        </button>
      </div>
    </div>
  `,
  styles: ``
})
export class QuickSummaryComponent implements OnInit {
  private user: User | null = null;
  private statistics: Statistics | null = null;
  public isLoading: boolean = false;
  public errorMessage: string = '';

  private router = inject(Router);
  private userService = inject(UserService);
  private statsService = inject(StatsService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';


    forkJoin({
      user: this.userService.getUserMe().pipe(
        catchError(error => {
          console.error('Error loading user:', error);
          return of(null);
        })
      ),
      stats: this.statsService.getStatisticsMe().pipe(
        catchError(error => {
          console.error('Error loading statistics:', error);
          return of(null);
        })
      )
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ({ user, stats }) => {
          this.user = user;
          this.statistics = stats;

          if (!user && !stats) {
            this.errorMessage = 'Failed to load user data and statistics.';
          } else if (!user) {
            this.errorMessage = 'Failed to load user data.';
          } else if (!stats) {
            this.errorMessage = 'Failed to load statistics.';
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'An unexpected error occurred.';
        }
      });
  }

  getUserName(): string {
    if (!this.user) return 'User';


    if (this.user.username && this.user.username.trim() !== '') {
      return this.user.username;
    }


    if (this.user.email) {
      return this.user.email.split('@')[0];
    }

    return 'User';
  }

  getLastSessionScore(): number {
    if (!this.statistics || !this.statistics.dailyProgresses || this.statistics.dailyProgresses.length === 0) {
      return 0;
    }


    const lastDay = [...this.statistics.dailyProgresses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return lastDay?.averageScore ? Math.round(lastDay.averageScore) : 0;
  }

  getImprovementStatus(): string {
    if (!this.statistics || !this.statistics.monthlyProgresses || this.statistics.monthlyProgresses.length < 2) {
      return 'Starting';
    }


    const lastTwoMonths = [...this.statistics.monthlyProgresses]
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
      .slice(0, 2);

    if (lastTwoMonths.length < 2) return 'Starting';

    const currentMonthScore = lastTwoMonths[0].averageScore || 0;
    const previousMonthScore = lastTwoMonths[1].averageScore || 0;
    const difference = currentMonthScore - previousMonthScore;

    if (difference > 5) return 'Improving Rapidly';
    if (difference > 0) return 'Improving';
    if (difference > -5) return 'Stable';
    return 'Needs Improvement';
  }

  getImprovementIcon(): string {
    const status = this.getImprovementStatus();

    switch (status) {
      case 'Improving Rapidly':
        return 'icon-trending-up text-emerald-400';
      case 'Improving':
        return 'icon-trending-up text-emerald-400';
      case 'Stable':
        return 'icon-minus text-amber-400';
      case 'Needs Improvement':
        return 'icon-trending-down text-destructive';
      default:
        return 'icon-help-circle text-muted-foreground';
    }
  }

  getCurrentStreak(): number {
    if (!this.statistics || !this.statistics.dailyProgresses) {
      return 0;
    }


    const sortedDays = [...this.statistics.dailyProgresses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(day => new Date(day.date).toDateString());

    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);


    if (sortedDays.includes(today.toDateString())) {
      streak++;
    }


    for (let i = 1; i <= 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      if (sortedDays.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  goToMonitoring() {
    this.router.navigate(['/monitoring/start']);
  }
}
