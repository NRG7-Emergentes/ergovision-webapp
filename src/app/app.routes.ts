import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import {SettingsPageComponent} from '@app/settings/pages/settings-page.component/settings-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent },
  { path: 'monse', component: MonseCamComponent },
  { path: 'settings' , component: SettingsPageComponent },
  { path: '' , component: TestPageComponent }
];
