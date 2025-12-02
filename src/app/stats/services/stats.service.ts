import {Statistics} from '@app/stats/domain/statistics.entity';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '@shared/services/base.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class StatsService extends BaseService<Statistics>{
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/statistics';
  }

  getStatisticsMe(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.basePath}${this.resourceEndpoint}/me`);
  }
  /*
  * {
  "id": 0,
  "userId": 0,
  "monthlyProgresses": [
    {
      "id": 0,
      "month": "string",
      "averageScore": 0
    }
  ],
  "dailyProgresses": [
    {
      "id": 0,
      "date": "string",
      "averageScore": 0
    }
  ],
  "globalAverageScore": 0,
  "averageSessionTimeMinutes": 0,
  "averagePausesPerSession": 0,
  "totalMonitoredHours": 0
}
  * */

}
