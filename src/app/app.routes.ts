import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import { StartMonitoringComponent } from '@app/monitoring/presentation/monitoring-view/start-monitoring.component';
import { ActiveMonitoringComponent } from '@app/monitoring/presentation/monitoring-view/active-monitoring.component';
import { BreakPageComponent } from '@app/monitoring/presentation/monitoring-view/break-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent},
  {path: 'monse', component: MonseCamComponent},
  { path: 'monitoring/start', component: StartMonitoringComponent },
  { path: 'monitoring/active', component: ActiveMonitoringComponent },
  { path: 'monitoring/break', component: BreakPageComponent },
  { path: '' , component: TestPageComponent }
];
