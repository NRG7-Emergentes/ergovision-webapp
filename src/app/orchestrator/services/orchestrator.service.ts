import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  PostureSetting,
  CreatePostureSetting,
  UpdatePostureSetting,
  AlertSetting,
  CreateAlertSetting,
  UpdateAlertSetting, NotificationSetting, UpdateNotificationSetting, CreateNotificationSetting, CalibrationDetails,
  UpdateCalibrationDetails
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
    return this.http.get<AlertSetting>(`${this.apiUrl}/alerts-settings/user/${userId}`);
  }

  getAlertSettingById(id: number): Observable<AlertSetting> {
    return this.http.get<AlertSetting>(`${this.apiUrl}/alerts-settings/${id}`);
  }

  createAlertSetting(resource: CreateAlertSetting): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/alerts-settings`, resource);
  }

  updateAlertSetting(id: number, resource: UpdateAlertSetting): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/alerts-settings/${id}`, resource);
  }

  deleteAlertSetting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alerts-settings/${id}`);
  }

  // ===================== NOTIFICATION SETTINGS =====================
  getUserNotificationSetting(userId: number): Observable<NotificationSetting> {
    return this.http.get<NotificationSetting>(`${this.apiUrl}/notification-settings/user/${userId}`);
  }

  getNotificationSettingById(id: number): Observable<NotificationSetting> {
    return this.http.get<NotificationSetting>(`${this.apiUrl}/notification-settings/${id}`);
  }

  createNotificationSetting(resource: CreateNotificationSetting): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/notification-settings`, resource);
  }

    updateNotificationSetting(id: number, resource: UpdateNotificationSetting): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/notification-settings/${id}`, resource);
  }

  deleteNotificationSetting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notification-settings/${id}`);
  }

  // ===================== CALIBRATION DETAILS =====================
  getUserCalibrationDetails(userId: number): Observable<CalibrationDetails> {
    return this.http.get<CalibrationDetails>(`${this.apiUrl}/calibration-details/user/${userId}`);
  }

  updateCalibrationDetails(id: number, resource: UpdateCalibrationDetails): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/calibration-details/${id}`, resource);
  }
}
