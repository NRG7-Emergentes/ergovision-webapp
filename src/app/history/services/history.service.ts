import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SessionSummary {
  id: string;
  date: string;
  duration: string;
}

export interface SessionDetail {
  id: string;
  date: string;
  duration: string;
  posture: {
    goodPercent: number;
    badPercent: number;
    goodTime: string;
    badTime: string;
  };
  pauses: {
    count: number;
    avgTime: string;
  };
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly summaries: SessionSummary[] = [
    { id: 's1', date: '2025-10-20', duration: '01:30:00' },
    { id: 's2', date: '2025-10-21', duration: '00:45:30' },
    { id: 's3', date: '2025-10-22', duration: '02:10:15' }
  ];

  private readonly details: Record<string, SessionDetail> = {
    s1: {
      id: 's1',
      date: '2025-10-20',
      duration: '01:30:00',
      posture: { goodPercent: 80, badPercent: 20, goodTime: '01:12:00', badTime: '00:18:00' },
      pauses: { count: 3, avgTime: '00:03:30' }
    },
    s2: {
      id: 's2',
      date: '2025-10-21',
      duration: '00:45:30',
      posture: { goodPercent: 65, badPercent: 35, goodTime: '00:29:30', badTime: '00:16:00' },
      pauses: { count: 1, avgTime: '00:05:00' }
    },
    s3: {
      id: 's3',
      date: '2025-10-22',
      duration: '02:10:15',
      posture: { goodPercent: 90, badPercent: 10, goodTime: '01:57:08', badTime: '00:13:07' },
      pauses: { count: 5, avgTime: '00:02:40' }
    }
  };

  listSessions(): Observable<SessionSummary[]> {
    return of(this.summaries);
  }

  getSession(id: string): Observable<SessionDetail | undefined> {
    return of(this.details[id]);
  }
}
