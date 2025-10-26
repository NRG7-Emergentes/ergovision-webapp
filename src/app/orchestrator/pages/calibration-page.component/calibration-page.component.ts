import { Component } from '@angular/core';
import {CameraViewComponent} from '@app/orchestrator/components/calibration-camera/camera-view.component';
import {ZardIconComponent} from '@shared/components/icon/icon.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';


@Component({
  selector: 'app-calibration-page',
  imports: [
    CameraViewComponent,
    ZardIconComponent,
    ZardButtonComponent
  ],
  templateUrl: './calibration-page.component.html',
  styleUrl: './calibration-page.component.css'
})
export class CalibrationPageComponent {

}
