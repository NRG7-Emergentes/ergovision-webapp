import { Component } from '@angular/core';
import {ZardSwitchComponent} from '@shared/components/switch/switch.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    ZardSwitchComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {

}
