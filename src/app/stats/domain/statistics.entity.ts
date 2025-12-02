import { MonthlyProgress } from './monthly-progress.entity';
import { DailyProgress } from './daily-progress.entity';
export class Statistics {
  id: number;
  userId: number;
  monthlyProgresses: MonthlyProgress[];
  dailyProgresses: DailyProgress[];
  globalAverageScore: number;
  averageSessionTimeMinutes: number;
  averagePausesPerSession: number;
  totalMonitoredHours: number;
  constructor(
    id: number,
    userId: number,
    monthlyProgresses: MonthlyProgress[],
    dailyProgresses: DailyProgress[],
    globalAverageScore: number,
    averageSessionTimeMinutes: number,
    averagePausesPerSession: number,
    totalMonitoredHours: number,
  ) {
    this.id = id;
    this.userId = userId;
    this.monthlyProgresses = monthlyProgresses;
    this.dailyProgresses = dailyProgresses;
    this.globalAverageScore = globalAverageScore;
    this.averageSessionTimeMinutes = averageSessionTimeMinutes;
    this.averagePausesPerSession = averagePausesPerSession;
    this.totalMonitoredHours = totalMonitoredHours;
  }
}
