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
import { AuthenticationService } from '@app/iam/services/authentication.service';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);
  private readonly apiUrl = `${environment.apiUrl}/monitoringSession`;
  private readonly LOCAL_KEY = 'local_sessions_queue_v1';

  /**
   * Get all sessions for the current user
   */
  listSessions(): Observable<SessionSummary[]> {
    // Get userId from localStorage or from the auth service
    const userId = localStorage.getItem('user_id') || this.authService.userId()?.toString();
    
    if (!userId) {
      console.warn('[HistoryService] No user_id found, returning local sessions only');
      const local = this.getLocalSessions();
      return of(local.map(this.mapToSummary.bind(this)));
    }

    const url = `${this.apiUrl}/user/${userId}`;
    console.log('[HistoryService] GET request to:', url);
    
    return this.http.get<SessionResponse[]>(url).pipe(
      catchError(err => {
        console.warn('[HistoryService] GET failed, returning local sessions only', err);
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
    const numericId = parseInt(id, 10);
    
    // If ID is negative, it's a local session
    if (numericId < 0) {
      console.log('[HistoryService] Looking for local session with ID:', id);
      const localSessions = this.getLocalSessions();
      const session = localSessions.find(s => s.id === numericId);
      
      if (session) {
        console.log('[HistoryService] Found local session:', session);
        return of(this.mapToDetail(session));
      } else {
        console.warn('[HistoryService] Local session not found:', id);
        return of(undefined);
      }
    }
    
    // Otherwise, fetch from backend
    const url = `${this.apiUrl}/${id}`;
    console.log('[HistoryService] GET request to:', url);
    
    return this.http.get<SessionResponse>(url).pipe(
      map(session => {
        console.log('[HistoryService] Raw session from backend:', session);
        const mapped = this.mapToDetail(session);
        console.log('[HistoryService] Mapped session detail:', mapped);
        return mapped;
      }),
      catchError(err => {
        console.error('[HistoryService] Error fetching session from backend:', err);
        
        // Try to find in local sessions as fallback
        const localSessions = this.getLocalSessions();
        const session = localSessions.find(s => s.id === numericId);
        
        if (session) {
          console.log('[HistoryService] Found session in local fallback:', session);
          return of(this.mapToDetail(session));
        }
        
        return of(undefined);
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
    console.log('[HistoryService] Mapping session to summary:', session);
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
   * Format date string to readable format (YYYY-MM-DD)
   * Handles backend format: DD-MM-YYYY HH:mm:ss
   */
  private formatDate(dateString: string): string {
    try {
      if (!dateString) return 'N/A';
      
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Parse backend format: DD-MM-YYYY HH:mm:ss
      const dateTimeRegex = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;
      const match = dateString.match(dateTimeRegex);
      
      if (match) {
        const [, day, month, year] = match;
        return `${year}-${month}-${day}`;
      }
      
      // Try to parse as standard date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      
      console.warn('[HistoryService] Invalid date format:', dateString);
      return 'Invalid Date';
    } catch (error) {
      console.error('[HistoryService] Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
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
