import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MonitorCamComponent } from '@app/monitoring/components/monitor-cam/monitor-cam.component';

@Component({
  selector: 'app-monse-cam',
  imports: [MonitorCamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <app-monitor-cam></app-monitor-cam>
    </div>
  `,
  styles: ``
})
export class MonseCamComponent {}
