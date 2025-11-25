
export class MonitoringSession {
  id: number;
  startDate: Date;
  endDate: Date;
  score: number;
  goodScore: number;
  badScore: number;
  goodPostureTime: number;
  badPostureTime: number;
  duration: number;
  numberOfPauses: number;
  averagePauseDuration: number;

  constructor(id: number, startDate: Date, endDate: Date, score: number, goodScore: number, badScore: number, goodPostureTime: number, badPostureTime: number, duration: number, numberOfPauses: number, averagePauseDuration: number) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.score = score;
    this.goodScore = goodScore;
    this.badScore = badScore;
    this.goodPostureTime = goodPostureTime;
    this.badPostureTime = badPostureTime;
    this.duration = duration;
    this.numberOfPauses = numberOfPauses;
    this.averagePauseDuration = averagePauseDuration;
  }

}
