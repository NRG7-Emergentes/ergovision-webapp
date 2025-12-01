export class DailyProgress {
  id: number;
  date: string;
  averageScore: number;

  constructor(
    id: number,
    date: string,
    averageScore: number,
  ) {
    this.id = id;
    this.date = date;
    this.averageScore = averageScore;
  }
}
