import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  PostureSetting,
  CreatePostureSetting,
  UpdatePostureSetting,
  AlertSetting,
  CreateAlertSetting,
  UpdateAlertSetting
} from '../models/orchestrator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrchestratorService {
  private apiUrl = `${environment.apiUrl}/orchestrator`;

  constructor(private http: HttpClient) {}

  // ===================== POSTURE SETTINGS =====================

  getUserPostureSetting(userId: number): Observable<PostureSetting> {
    return this.http.get<PostureSetting>(`${this.apiUrl}/posture-settings/user/${userId}`);
  }

  getPostureSettingById(id: number): Observable<PostureSetting> {
    return this.http.get<PostureSetting>(`${this.apiUrl}/posture-settings/${id}`);
  }

  createPostureSetting(resource: CreatePostureSetting): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/posture-settings`, resource);
  }

  updatePostureSetting(id: number, resource: UpdatePostureSetting): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/posture-settings/${id}`, resource);
  }

  deletePostureSetting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posture-settings/${id}`);
  }

  // ===================== ALERT SETTINGS =====================

  getUserAlertSetting(userId: number): Observable<AlertSetting> {
    return this.http.get<AlertSetting>(`${this.apiUrl}/alert-settings/user/${userId}`);
  }

  getAlertSettingById(id: number): Observable<AlertSetting> {
    return this.http.get<AlertSetting>(`${this.apiUrl}/alert-settings/${id}`);
  }

  createAlertSetting(resource: CreateAlertSetting): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/alert-settings`, resource);
  }

  updateAlertSetting(id: number, resource: UpdateAlertSetting): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/alert-settings/${id}`, resource);
  }

  deleteAlertSetting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alert-settings/${id}`);
  }
}
