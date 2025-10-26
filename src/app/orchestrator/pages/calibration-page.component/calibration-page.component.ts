import { Component } from '@angular/core';
import {CameraViewComponent} from '@app/orchestrator/components/calibration-camera/camera-view.component';


@Component({
  selector: 'app-calibration-page',
  imports: [
    CameraViewComponent
  ],
  templateUrl: './calibration-page.component.html',
  styleUrl: './calibration-page.component.css'
})
export class CalibrationPageComponent {

}
