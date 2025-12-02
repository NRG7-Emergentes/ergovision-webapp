export class MonthlyProgress{
  id: number;
  month: string
  averageScore: number;

  constructor(
    id: number,
    month: string,
    averageScore: number,
  ) {
    this.id = id;
    this.month = month;
    this.averageScore = averageScore;
  }
}
