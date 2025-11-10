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
  alertInterval: number;
}

export interface CreateAlertSetting {
  userId: number;
  visualAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  alertVolume: number;
  alertInterval: number;
}

export interface UpdateAlertSetting {
  visualAlertsEnabled: boolean;
  soundAlertsEnabled: boolean;
  alertVolume: number;
  alertInterval: number;
}
