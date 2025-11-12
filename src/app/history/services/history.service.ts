import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
  private readonly LOCAL_KEY = 'local_sessions_queue_v1';

  /**
   * Get all sessions for the current user
   */
  listSessions(): Observable<SessionSummary[]> {
    const url = this.apiUrl;
    console.log('[HistoryService] GET request to:', url);
    return this.http.get<SessionResponse[]>(url).pipe(
      catchError(err => {
        console.warn('[HistoryService] GET failed, returning backend empty and will include local sessions', err);
        return of([] as SessionResponse[]);
      }),
      map(sessions => {
        console.log('[HistoryService] Raw response from backend:', sessions);
        const local = this.getLocalSessions();
        console.log('[HistoryService] Local queued sessions:', local);
        const combined = [...sessions, ...local];
        const mapped = combined.map(this.mapToSummary.bind(this));
        console.log('[HistoryService] Mapped sessions (combined):', mapped);
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
    return this.http.post<SessionResponse>(url, sessionData).pipe(
      catchError(err => {
        // If backend rejects (401 or otherwise), save locally and return a local SessionResponse
        console.warn('[HistoryService] POST failed, saving session locally:', err);
        const local = this.saveLocalSession(sessionData);
        return of(local);
      })
    );
  }

  /**
   * Save a session locally in localStorage (used as a fallback when backend is unavailable/unauthorized)
   */
  private saveLocalSession(sessionData: SessionCreateDto): SessionResponse {
    const local = this.getLocalSessions();
    const id = -Date.now(); // negative id so it won't collide with backend ids
    const entry: SessionResponse = {
      id,
      startDate: sessionData.startDate,
      endDate: sessionData.endDate,
      score: sessionData.score,
      goodScore: sessionData.goodScore,
      badScore: sessionData.badScore,
      goodPostureTime: sessionData.goodPostureTime,
      badPostureTime: sessionData.badPostureTime,
      duration: sessionData.duration,
      numberOfPauses: sessionData.numberOfPauses,
      averagePauseDuration: sessionData.averagePauseDuration
    };

    local.unshift(entry);
    try {
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(local));
    } catch (e) {
      console.error('[HistoryService] Failed to persist local session queue:', e);
    }

    return entry;
  }

  /**
   * Read queued local sessions from localStorage. Returns array of SessionResponse.
   */
  private getLocalSessions(): SessionResponse[] {
    try {
      const raw = localStorage.getItem(this.LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SessionResponse[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('[HistoryService] Failed to read local session queue:', e);
      return [];
    }
  }

  /**
   * Try to sync local queued sessions with backend. Will attempt each item and remove those that succeed.
   * Returns an observable that completes when sync attempts are done (no detailed result is returned here).
   */
  syncLocalSessions(): Observable<void> {
    const queued = this.getLocalSessions();
    if (!queued.length) return of(undefined);

    // Try sequentially to avoid flooding; basic approach: attempt each POST and remove on success.
    // For simplicity we'll map to an array of observables and run them in sequence.
    const attempts = queued.map(s =>
      this.http.post<SessionResponse>(this.apiUrl, s).pipe(
        catchError(err => {
          console.warn('[HistoryService] Sync failed for local session id', s.id, err);
          return of(null as SessionResponse | null);
        })
      )
    );

    // Run attempts sequentially using from/concatMap to process results and update storage.
    return new Observable<void>(subscriber => {
      (async () => {
        const stillQueued: SessionResponse[] = [];
        for (let i = 0; i < queued.length; i++) {
          const item = queued[i];
          try {
            const res = await attempts[i].toPromise();
            if (res && res.id && res.id > 0) {
              console.log('[HistoryService] Synced local session to backend:', res);
            } else {
              stillQueued.push(item);
            }
          } catch (e) {
            console.warn('[HistoryService] Exception while syncing local session:', e);
            stillQueued.push(item);
          }
        }

        // Save remaining queue
        try {
          localStorage.setItem(this.LOCAL_KEY, JSON.stringify(stillQueued));
        } catch (e) {
          console.error('[HistoryService] Failed to persist remaining local queue after sync:', e);
        }

        subscriber.next();
        subscriber.complete();
      })();
    });
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
