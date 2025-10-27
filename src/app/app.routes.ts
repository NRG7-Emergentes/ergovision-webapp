import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent},
  { path: 'progress/:id' , component: StatsPageComponent},
  {path: 'monse', component: MonseCamComponent},
  { path: 'monitoring/start', component: StartMonitoringComponent },
  { path: 'monitoring/active', component: ActiveMonitoringComponent },
  { path: 'monitoring/break', component: BreakPageComponent },
  { path: '' , component: TestPageComponent }
];
