import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import {
  SessionCreateDto,
  SessionResponse,
  SessionSummary,
  SessionDetail
} from '@app/history/models/session.model';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/monitoringSession`;

  /**
   * Get all sessions for the current user
   */
  listSessions(): Observable<SessionSummary[]> {
    const url = this.apiUrl;
    console.log('[HistoryService] GET request to:', url);
    
    return this.http.get<SessionResponse[]>(url).pipe(
      map(sessions => {
        console.log('[HistoryService] Raw response from backend:', sessions);
        const mapped = sessions.map(this.mapToSummary.bind(this));
        console.log('[HistoryService] Mapped sessions:', mapped);
        return mapped;
      })
    );
  }

  /**
   * Get detailed information about a specific session
   */
  getSession(id: string): Observable<SessionDetail | undefined> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[HistoryService] GET request to:', url);
    
    return this.http.get<SessionResponse>(url).pipe(
      map(session => {
        console.log('[HistoryService] Raw session from backend:', session);
        const mapped = this.mapToDetail(session);
        console.log('[HistoryService] Mapped session detail:', mapped);
        return mapped;
      })
    );
  }

  /**
   * Create a new monitoring session
   */
  createSession(sessionData: SessionCreateDto): Observable<SessionResponse> {
    const url = this.apiUrl;
    console.log('[HistoryService] POST request to:', url);
    console.log('[HistoryService] Request body:', sessionData);
    
    return this.http.post<SessionResponse>(url, sessionData);
  }

  /**
   * Map API response to SessionSummary for list display
   */
  private mapToSummary(session: SessionResponse): SessionSummary {
    return {
      id: session.id.toString(),
      date: this.formatDate(session.startDate),
      duration: this.secondsToHms(session.duration)
    };
  }

  /**
   * Map API response to SessionDetail for detail display
   */
  private mapToDetail(session: SessionResponse): SessionDetail {
    const totalTime = session.duration;
    const goodTime = session.goodPostureTime;
    const badTime = session.badPostureTime;

    // Calculate percentages
    const activeTime = goodTime + badTime; // total active time (excluding pauses)
    const goodPercent = activeTime > 0 ? Math.round((goodTime / activeTime) * 100) : 0;
    const badPercent = activeTime > 0 ? Math.round((badTime / activeTime) * 100) : 0;

    // Calculate total pause time
    const totalPauseTime = session.numberOfPauses * session.averagePauseDuration;

    return {
      id: session.id.toString(),
      date: this.formatDate(session.startDate),
      duration: this.secondsToHms(totalTime),
      posture: {
        goodPercent,
        badPercent,
        goodTime: this.secondsToHms(goodTime),
        badTime: this.secondsToHms(badTime)
      },
      pauses: {
        count: session.numberOfPauses,
        avgTime: this.secondsToHms(session.averagePauseDuration),
        totalTime: this.secondsToHms(totalPauseTime)
      }
    };
  }

  /**
   * Format ISO date string to readable format (YYYY-MM-DD)
   */
  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  }

  /**
   * Convert seconds to HH:MM:SS format
   */
  private secondsToHms(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
