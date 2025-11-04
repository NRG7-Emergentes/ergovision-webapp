import { Component } from '@angular/core';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';
import {ZardSliderComponent} from '@shared/components/slider/slider.component';
import {ZardSelectComponent} from '@shared/components/select/select.component';
import {ZardSelectItemComponent} from '@shared/components/select/select-item.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings-page',
  imports: [
    ZardSwitchComponent,
    ZardSliderComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardButtonComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {

  constructor(private router: Router) {
  }

  redirectToCalibration() {
    this.router.navigate(['/calibration']);
  }
}
