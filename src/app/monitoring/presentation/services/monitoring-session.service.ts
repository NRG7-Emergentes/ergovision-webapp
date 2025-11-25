import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MonitoringSession } from '../domain/model/monitoring-session';
import { BaseService } from '@app/shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MonitoringSessionService extends BaseService<MonitoringSession> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/monitoringSession';
  }

  createMonitoringSession(data: Omit<MonitoringSession, 'id'>): Observable<MonitoringSession> {
    // Convert Date objects to ISO strings for the API
    const apiData = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString()
    };

    return this.create(apiData).pipe(
      map(response => new MonitoringSession(
        response.id,
        new Date(response.startDate),
        new Date(response.endDate),
        response.score,
        response.goodScore,
        response.badScore,
        response.goodPostureTime,
        response.badPostureTime,
        response.duration,
        response.numberOfPauses,
        response.averagePauseDuration
      ))
    );
  }

  getMonitoringSession(id: number): Observable<MonitoringSession> {
    return this.getById(id).pipe(
      map(response => new MonitoringSession(
        response.id,
        new Date(response.startDate),
        new Date(response.endDate),
        response.score,
        response.goodScore,
        response.badScore,
        response.goodPostureTime,
        response.badPostureTime,
        response.duration,
        response.numberOfPauses,
        response.averagePauseDuration
      ))
    );
  }
}

