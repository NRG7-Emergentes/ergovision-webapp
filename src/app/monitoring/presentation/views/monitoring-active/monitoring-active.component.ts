import {Component, inject, signal} from '@angular/core';
import {MonitorCamComponent} from '@app/monitoring/presentation/components/monitor-cam/monitor-cam.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';
import {FormsModule} from '@angular/forms';
import {ZardSliderComponent} from '@shared/components/slider/slider.component';
import {Router} from '@angular/router';
import {ZardDialogService} from '@shared/components/dialog/dialog.service';
import {
  ActivePauseDialogComponent
} from '@app/monitoring/presentation/components/active-pause-dialog/active-pause-dialog.component';

@Component({
  selector: 'app-monitoring-active',
  imports: [
    MonitorCamComponent,
    ZardButtonComponent,
    ZardSwitchComponent,
    FormsModule,
    ZardSliderComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="col-span-2 overflow-hidden rounded-lg border ">
          <div class="w-full h-auto object-cover block">
            <app-monitor-cam/>
          </div>
        </div>
        <div class="col-span-1 space-y-4">
          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full ">

            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Pauses</h2>

            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center">
                <span class="text-md"> Next Pause in: </span>
                <span class="text-md text-muted-foreground"> 00:09:48 </span>
              </div>
              <button z-button (click)="onPauseInit()">
                <i class="icon-pause  "></i>
                Pause
              </button>
            </div>
          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full ">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Alerts</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center justify-between ">
                <p class="text-sm font-semibold text-foreground">Visual Alerts</p>
                <z-switch (checkChange)="visualAlerts.set($event)" [ngModel]="visualAlerts()"/>
              </div>

              <div class="flex items-center justify-between ">
                <p class="text-sm font-semibold text-foreground">Sound Alerts</p>
                <z-switch (checkChange)="soundAlerts.set($event)" [ngModel]="soundAlerts()"/>
              </div>
            </div>

          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Posture Status</h2>
            <div class="space-y-2 mb-4">
              <label class="text-sm font-semibold text-foreground">Nose Offset Sensitivity</label>

              <div class="flex items-center gap-3">
                <z-slider class="w-full" [zMin]="0" [zMax]="100" [zStep]="1" [zValue]="noseOffsetSensitivity()"
                          [zDefault]="noseOffsetSensitivity()" (onSlide)="noseOffsetSensitivity.set($event)"/>
                <span class="text-sm text-muted-foreground min-w-10"> {{ noseOffsetSensitivity() }} % </span>
                <button z-button zType="secondary" class="border">
                  Use Current
                </button>
              </div>




            </div>
            <div class="p-4 bg-secondary rounded-lg ">
              <p class="text-2xl font-bold">You're sitting well</p>
              <div class="text-muted-foreground text-md">
                <span> Nose Offset:  </span>
                <span> {{ noseOffset() }}% </span>
              </div>
            </div>
          </div>

          <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
            <h2 class="text-xl font-bold text-foreground mb-4 -tracking-normal">Time </h2>

            <div class="flex justify-between items-center">
              <span class="text-md"> Monitoring time: </span>
              <span class="text-md text-muted-foreground"> 01:30:48 </span>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-md"> Bad posture time: </span>
              <span class="text-md text-muted-foreground"> 00:01:48 </span>
            </div>


          </div>
        </div>


      </div>
      <button z-button zType="destructive" zSize="lg" (click)="onFinishSession()">
        <i class="icon-square  "></i>
        Finish Session
      </button>
    </div>
  `,
  styles: ``,
})
export class MonitoringActiveComponent {
  protected readonly visualAlerts = signal<boolean>(true);
  protected readonly soundAlerts = signal<boolean>(true);

  protected readonly alertInterval = signal<string>("10");

  protected readonly pauseInterval = signal<string>("10");
  protected readonly noseOffsetSensitivity = signal<number>(43);
  protected readonly noseOffset = signal<number>(24.5);

  private router = inject(Router);
  private dialogService = inject(ZardDialogService);

  onFinishSession(){
    this.router.navigate(['/history']);
  }

  onPauseInit(){
    this.dialogService.create({
      zContent: ActivePauseDialogComponent,
      zData: {} ,
      zOkText: 'Finish Pause',
      zCancelText: null,
      zOnOk: instance => {
        console.log('Pause Finished');
      },
      zWidth: '1280px',
      zClosable: false,
    });
  }



}
