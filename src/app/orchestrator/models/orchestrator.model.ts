export interface PostureThresholds {
  shoulderMax: number;
  headMax: number;
  shoulderMin: number;
  headMin: number;
}

export interface PostureSetting {
  id: number;
  userId: number;
  postureSensitivity: number;
  shoulderAngleThreshold: number;
  headAngleThreshold: number;
  samplingFrequency: number;
  showSkeleton: boolean;
  postureThresholds: PostureThresholds;
}

export interface CreatePostureSetting {
  userId: number;
  postureSensitivity: number;
  shoulderAngleThreshold: number;
  headAngleThreshold: number;
  samplingFrequency: number;
  showSkeleton: boolean;
  postureThresholds: PostureThresholds;
}

export interface UpdatePostureSetting {
  postureSensitivity: number;
  shoulderAngleThreshold: number;
  headAngleThreshold: number;
  samplingFrequency: number;
  showSkeleton: boolean;
  postureThresholds: PostureThresholds;
}

export interface AlertSetting {
  id: number;
  userId: number;
  visualAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  alertVolume: number;
  pauseInterval: number;
}

export interface CreateAlertSetting {
  userId: number;
  visualAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  alertVolume: number;
  pauseInterval: number;
}

export interface UpdateAlertSetting {
  visualAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  alertVolume: number;
  pauseInterval: number;
}

export interface NotificationSetting {
  id: number;
  userId: number;
  emailNotifications: boolean;
}

export interface CreateNotificationSetting {
  userId: number;
  emailNotifications: boolean;
}

export interface UpdateNotificationSetting {
  emailNotifications: boolean;
}

export interface CalibrationDetails {
  id: number;
  userId: number;
  calibrationScore: number;
  cameraDistance: number;
  cameraVisibility: number;
  shoulderAngle: number;
  headAngle: number;
  calibratedAt: string;
}

export interface CreateCalibrationDetails {
  userId: number;
  calibrationScore: number;
  cameraDistance: number;
  cameraVisibility: number;
  shoulderAngle: number;
  headAngle: number;
}

export interface UpdateCalibrationDetails {
  calibrationScore: number;
  cameraDistance: number;
  cameraVisibility: number;
  shoulderAngle: number;
  headAngle: number;
}
