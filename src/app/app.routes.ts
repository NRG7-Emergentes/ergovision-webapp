import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import {StatsPageComponent} from '@app/stats/presentation/stats-page/stats-page.component';
import {StartMonitoringComponent} from '@app/monitoring/presentation/monitoring-view/start-monitoring.component';
import { HistoryPageComponent } from '@app/history/pages/history-page/history-page.component';
import { SessionPageComponent } from '@app/history/pages/session-page/session-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent},
  { path: 'progress/:id' , component: StatsPageComponent},
  {path: 'monse', component: MonseCamComponent},
  { path: 'monitoring/start', component: StartMonitoringComponent },
  { path: 'monse', component: MonseCamComponent },
  { path: 'history', component: HistoryPageComponent },        // follow the same template as 'monse'
  { path: 'history/:id', component: SessionPageComponent },    // explicit detail route
  { path: '' , component: TestPageComponent }
];
