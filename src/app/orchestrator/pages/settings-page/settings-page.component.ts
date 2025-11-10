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
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-foreground mb-8 tracking-tight">Configuration</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-bold text-foreground mb-4">Posture</h2>
            <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
              <div class="space-y-2 mb-4">
                <label class="text-sm font-semibold text-foreground">Posture Sensitivity</label>

                <div class="flex items-center gap-3">
                  <z-slider class="w-full" [zMin]="0" [zMax]="100" [zStep]="1" [zValue]="postureSensitivity()"
                            [zDefault]="postureSensitivity()" (onSlide)="postureSensitivity.set($event)" />
                  <span class="text-sm text-muted-foreground min-w-10"> {{postureSensitivity()}} % </span>
                </div>


              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <p class="text-sm font-semibold text-foreground">Sampling Frequency</p>
                  <z-select zPlaceholder="Select a Sampling Frequency"
                            [zValue]="sampleFrequency()" (zSelectionChange)="sampleFrequency.set($event)">
                    <z-select-item zValue="1">1/1 frames (every frame)</z-select-item>
                    <z-select-item zValue="2">1/5 frames</z-select-item>
                    <z-select-item zValue="3">1/10 frames</z-select-item>
                    <z-select-item zValue="4">1/20 frames</z-select-item>
                    <z-select-item zValue="5" >1/30 frames</z-select-item>
                  </z-select>
                </div>
                <div class="space-y-2 flex flex-col">
                  <p class="text-sm font-semibold text-foreground">CameraView</p>
                  <div class="flex-1 flex items-center justify-between ">
                    <label class="text-sm font-medium text-foreground">Render Skeleton</label>
                    <z-switch (checkChange)="showSkeleton.set($event)" [ngModel]="showSkeleton()" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 class="text-lg font-bold text-foreground mb-4">Alerts & Pause</h2>
            <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center justify-between ">
                  <p class="text-sm font-semibold text-foreground">Visual Alerts</p>
                  <z-switch (checkChange)="visualAlertsEnabled.set($event)" [ngModel]="visualAlertsEnabled()" />
                </div>

                <div class="flex items-center justify-between ">
                  <p class="text-sm font-semibold text-foreground">Sound Alerts</p>
                  <z-switch (checkChange)="soundAlertsEnabled.set($event)" [ngModel]="soundAlertsEnabled()" />
                </div>

                <div class="space-y-2">
                  <p class="text-sm font-semibold text-foreground">Pause Interval</p>
                  <z-select zPlaceholder="Select an Interval"
                            [zValue]="alertInterval()" (zSelectionChange)="alertInterval.set($event)">
                    <z-select-item zValue="1">Every 5 minutes</z-select-item>
                    <z-select-item zValue="2">Every 10 minutes</z-select-item>
                    <z-select-item zValue="3">Every 15 minutes</z-select-item>
                    <z-select-item zValue="4">Every 30 minutes</z-select-item>
                  </z-select>
                </div>

                <div class="space-y-2 flex flex-col">
                  <label class="text-sm font-semibold text-foreground">Alert Volume</label>

                  <div class="flex-1 flex items-center gap-3">
                    <z-slider class="w-full" [zMin]="0" [zMax]="100" [zStep]="1" [zValue]="alertVolume()"
                              [zDefault]="alertVolume()" (onSlide)="alertVolume.set($event)" />
                    <span class="text-sm text-muted-foreground min-w-10"> {{alertVolume()}} % </span>
                  </div>


                </div>
              </div>

            </div>
          </div>
          <div>
            <h2 class="text-lg font-bold text-foreground mb-4">Notifications</h2>
            <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
              <div class="flex items-center justify-between">
                <label class="text-sm font-semibold text-foreground">Mail Notifications</label>
                <z-switch/>
              </div>
            </div>
          </div>
          <button z-button zSize="lg" (click)="saveSettings()">
            <i class="icon-settings  "></i>
            Save Config
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-bold text-foreground mb-4">Calibration Details</h2>
            <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
              <div class="grid grid-cols-2 gap-4">
                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Calibration Score</p>
                  <p class="text-foreground font-semibold"> 92%</p>
                </div>

                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Calibration Date</p>
                  <p class="text-foreground font-semibold"> 14/1/2025 </p>
                </div>

                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Camera Distance</p>
                  <p class="text-foreground font-semibold"> 65.5 cm </p>
                </div>

                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Camera Visibility</p>
                  <p class="text-foreground font-semibold"> 95%</p>
                </div>

                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Shoulder Angle Threshold</p>
                  <p class="text-foreground font-semibold"> 15°</p>
                </div>

                <div class="py-2 px-4 rounded-2xl border border-border text-center bg-muted">
                  <p class="text-xs text-muted-foreground">Head Angle Threshold</p>
                  <p class="text-foreground font-semibold"> 20°</p>
                </div>
              </div>
              <button z-button zType="default" class="w-full mt-8" zSize="lg" (click)="goToCalibration()"> Recalibrate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SettingsPageComponent implements OnInit {
  protected readonly postureSensitivity = signal<number>(43);
  protected readonly alertVolume = signal<number>(16);
  protected readonly sampleFrequency = signal<string>('1');
  protected readonly alertInterval = signal<string>('1');
  protected readonly showSkeleton = signal<boolean>(true);
  protected readonly visualAlertsEnabled = signal<boolean>(true);
  protected readonly soundAlertsEnabled = signal<boolean>(true);

  private readonly postureSettingId = signal<number | null>(null);
  private readonly alertSettingId = signal<number | null>(null);

  private readonly router = inject(Router);
  private readonly orchestratorService = inject(OrchestratorService);

  ngOnInit(): void {
    const userId = 1; // TODO: get from auth service
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
        this.alertInterval.set(setting.alertInterval.toString());
        this.visualAlertsEnabled.set(setting.visualAlertsEnabled);
        this.soundAlertsEnabled.set(setting.soundAlertsEnabled);
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
      alertInterval: parseInt(this.alertInterval())
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
}
