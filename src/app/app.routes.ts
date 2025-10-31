import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import {StatsPageComponent} from '@app/stats/presentation/stats-page/stats-page.component';
import {StartMonitoringComponent} from '@app/monitoring/presentation/monitoring-view/start-monitoring.component';
import { HistoryPageComponent } from '@app/history/pages/history-page/history-page.component';
import { SessionPageComponent } from '@app/history/pages/session-page/session-page.component';
import {ProfileComponent} from '@app/profiles/presentation/components/profile/profile.component';
import {SignInComponent} from '@app/iam/presentation/components/sign-in/sign-in.component';
import {SignUpComponent} from '@app/iam/presentation/components/sign-up/sign-up.component';
import {NotFoundComponent} from '@app/public/pages/not-found/not-found.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent},
  { path: 'progress/:id' , component: StatsPageComponent},
  { path: 'monse', component: MonseCamComponent},
  { path: 'monitoring/start', component: StartMonitoringComponent },
  { path: 'history', component: HistoryPageComponent },
  { path: 'history/:id', component: SessionPageComponent },
  { path: 'sign-in', component: SignInComponent},
  { path: 'sign-up', component: SignUpComponent},
  {path: 'profile', component: ProfileComponent},
  { path: '' , component: TestPageComponent },
  { path: 'not-found' , component: NotFoundComponent}

];
