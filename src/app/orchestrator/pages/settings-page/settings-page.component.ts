import {Component, inject, signal, OnInit} from '@angular/core';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';
import {ZardSliderComponent} from '@shared/components/slider/slider.component';
import {ZardSelectComponent} from '@shared/components/select/select.component';
import {ZardSelectItemComponent} from '@shared/components/select/select-item.component';
import {FormsModule} from '@angular/forms';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';
import {toast} from 'ngx-sonner';
import {OrchestratorService} from '../../services/orchestrator.service';

@Component({
  selector: 'app-settings-page',
  imports: [
    ZardSwitchComponent,
    ZardSliderComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    FormsModule,
    ZardButtonComponent
  ],
  templateUrl: './settings-page.html',
  styles: ``,
})
export class SettingsPageComponent implements OnInit {
  protected readonly postureSensitivity = signal<number>(43);
  protected readonly alertVolume = signal<number>(16);
  protected readonly sampleFrequency = signal<string>('1');
  protected readonly pauseInterval = signal<number>(1);
  protected readonly showSkeleton = signal<boolean>(true);
  protected readonly visualAlertsEnabled = signal<boolean>(true);
  protected readonly soundAlertsEnabled = signal<boolean>(true);

  private readonly postureSettingId = signal<number | null>(null);
  private readonly alertSettingId = signal<number | null>(null);

  private readonly router = inject(Router);
  private readonly orchestratorService = inject(OrchestratorService);

  ngOnInit(): void {
    const userIdStr = localStorage.getItem("user_id");
    if (!userIdStr) {
      toast.error('User not authenticated');
      this.router.navigate(['/login']);
      return;
    }
    const userId = userIdStr ? parseInt(userIdStr) : 0;
    if (isNaN(userId)) {
      toast.error('Invalid user ID');
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserSettings(userId);
  }

  private loadUserSettings(userId: number): void {
    this.orchestratorService.getUserPostureSetting(userId).subscribe({
      next: (setting) => {
        this.postureSettingId.set(setting.id);
        this.postureSensitivity.set(setting.postureSensitivity);
        this.sampleFrequency.set(setting.samplingFrequency.toString());
        this.showSkeleton.set(setting.showSkeleton);
      },
      error: () => {
        toast.error('Failed to load posture settings');
      }
    });

    this.orchestratorService.getUserAlertSetting(userId).subscribe({
      next: (setting) => {
        this.alertSettingId.set(setting.id);
        this.alertVolume.set(setting.alertVolume);
        this.pauseInterval.set(setting.pauseInterval);
        this.visualAlertsEnabled.set(setting.visualAlertsEnabled);
        this.soundAlertsEnabled.set(setting.soundAlertsEnabled);
        console.log('Alert Settings:', {
          id: setting.id,
          volume: setting.alertVolume,
          interval: setting.pauseInterval,
          visualEnabled: setting.visualAlertsEnabled,
          soundEnabled: setting.soundAlertsEnabled
        });
      },
      error: () => {
        toast.error('Failed to load alert settings');
      }
    });
  }

  protected saveSettings(): void {
    const postureId = this.postureSettingId();
    const alertId = this.alertSettingId();

    if (!postureId || !alertId) {
      toast.error('Settings not loaded yet');
      return;
    }

    const postureData = {
      postureSensitivity: this.postureSensitivity(),
      shoulderAngleThreshold: 15, // TODO: get from calibration data
      headAngleThreshold: 20, // TODO: get from calibration data
      samplingFrequency: parseInt(this.sampleFrequency()),
      showSkeleton: this.showSkeleton(),
      postureThresholds: {
        shoulderMax: 0,
        headMax: 0,
        shoulderMin: 0,
        headMin: 0
      }
    };

    const alertData = {
      visualAlertsEnabled: this.visualAlertsEnabled(),
      soundAlertsEnabled: this.soundAlertsEnabled(),
      alertVolume: this.alertVolume(),
      pauseInterval: this.pauseInterval()
    };

    this.orchestratorService.updatePostureSetting(postureId, postureData).subscribe({
      next: () => toast.success('Posture settings saved'),
      error: () => toast.error('Error saving posture settings')
    });

    this.orchestratorService.updateAlertSetting(alertId, alertData).subscribe({
      next: () => toast.success('Alert settings saved'),
      error: () => toast.error('Error saving alert settings')
    });
  }

  protected goToCalibration(): void {
    this.router.navigate(['calibration']);
  }

  protected readonly Number = Number;
}
