import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryService } from '@app/history/services/history.service';
import { SessionCreateDto, SessionResponse } from '@app/history/models/session.model';

export interface MonitoringSessionData {
  startDate: Date;
  goodPostureTime: number;  // in seconds
  badPostureTime: number;   // in seconds
  numberOfPauses: number;
  totalPauseTime: number;   // in seconds
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringSessionService {
  private historyService = inject(HistoryService);

  // Session tracking signals
  readonly sessionData = signal<MonitoringSessionData>({
    startDate: new Date(),
    goodPostureTime: 0,
    badPostureTime: 0,
    numberOfPauses: 0,
    totalPauseTime: 0
  });

  // Session state
  private sessionStartTime: number | null = null;
  private isSessionActive = false;

  /**
   * Start a new monitoring session
   */
  startSession(): void {
    this.sessionStartTime = Date.now();
    this.isSessionActive = true;
    
    // Reset session data
    this.sessionData.set({
      startDate: new Date(),
      goodPostureTime: 0,
      badPostureTime: 0,
      numberOfPauses: 0,
      totalPauseTime: 0
    });
  }

  /**
   * Update session data during monitoring
   */
  updateSessionData(data: Partial<MonitoringSessionData>): void {
    if (!this.isSessionActive) return;

    this.sessionData.update(current => ({
      ...current,
      ...data
    }));
  }

  /**
   * Increment pause count
   */
  incrementPauseCount(): void {
    if (!this.isSessionActive) return;

    this.sessionData.update(current => ({
      ...current,
      numberOfPauses: current.numberOfPauses + 1
    }));
  }

  /**
   * Add pause duration to total
   */
  addPauseDuration(durationInSeconds: number): void {
    if (!this.isSessionActive) return;

    this.sessionData.update(current => ({
      ...current,
      totalPauseTime: current.totalPauseTime + durationInSeconds
    }));
  }

  /**
   * Save current session to backend and return Observable
   */
  saveSession(): Observable<SessionResponse> {
    if (!this.isSessionActive) {
      throw new Error('No active session to save');
    }

    const data = this.sessionData();
    const endDate = new Date();
    const durationInSeconds = Math.floor((endDate.getTime() - data.startDate.getTime()) / 1000);
    
    // Calculate scores (can be adjusted based on business logic)
    const totalActiveTime = data.goodPostureTime + data.badPostureTime;
    const goodScore = totalActiveTime > 0 ? Math.round((data.goodPostureTime / totalActiveTime) * 100) : 0;
    const badScore = totalActiveTime > 0 ? Math.round((data.badPostureTime / totalActiveTime) * 100) : 0;
    const score = goodScore; // Overall score can be goodScore or a weighted calculation
    
    // Calculate average pause duration
    const averagePauseDuration = data.numberOfPauses > 0 
      ? Math.floor(data.totalPauseTime / data.numberOfPauses) 
      : 0;
    
    const sessionDto: SessionCreateDto = {
      startDate: data.startDate.toISOString(),
      endDate: endDate.toISOString(),
      score: score,
      goodScore: goodScore,
      badScore: badScore,
      goodPostureTime: data.goodPostureTime,
      badPostureTime: data.badPostureTime,
      duration: durationInSeconds,
      numberOfPauses: data.numberOfPauses,
      averagePauseDuration: averagePauseDuration
    };

    console.log('Session DTO to send:', sessionDto);

    // Mark session as inactive
    this.isSessionActive = false;

    return this.historyService.createSession(sessionDto);
  }

  /**
   * Get current session data
   */
  getSessionData(): MonitoringSessionData {
    return this.sessionData();
  }

  /**
   * Check if there's an active session
   */
  hasActiveSession(): boolean {
    return this.isSessionActive;
  }

  /**
   * Reset session without saving
   */
  resetSession(): void {
    this.isSessionActive = false;
    this.sessionStartTime = null;
    
    this.sessionData.set({
      startDate: new Date(),
      goodPostureTime: 0,
      badPostureTime: 0,
      numberOfPauses: 0,
      totalPauseTime: 0
    });
  }
}
