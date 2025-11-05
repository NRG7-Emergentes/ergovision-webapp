import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import {StatsPageComponent} from '@app/stats/presentation/stats-page/stats-page.component';
import {StartMonitoringComponent} from '@app/monitoring/presentation/monitoring-view/start-monitoring.component';
import { HistoryPageComponent } from '@app/history/pages/history-page/history-page.component';
import { SessionPageComponent } from '@app/history/pages/session-page/session-page.component';
import {ProfileComponent} from '@app/iam/presentation/components/profile/profile.component';
import {SignInComponent} from '@app/iam/presentation/components/sign-in/sign-in.component';
import {SignUpComponent} from '@app/iam/presentation/components/sign-up/sign-up.component';
import {NotFoundComponent} from '@app/public/pages/not-found/not-found.component';
import { authGuard } from '@app/iam/guards/auth.guard';
import {SettingsPageComponent} from '@app/orchestrator/pages/settings-page.component/settings-page.component';
import {CalibrationPageComponent} from '@app/orchestrator/pages/calibration-page.component/calibration-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id', component: MainDashboardComponent, canActivate: [authGuard] },
  { path: 'progress/:id', component: StatsPageComponent, canActivate: [authGuard] },
  { path: 'monitoring/start', component: StartMonitoringComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryPageComponent, canActivate: [authGuard] },
  { path: 'history/:id', component: SessionPageComponent, canActivate: [authGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings' , component: SettingsPageComponent , canActivate: [authGuard] },
  { path: 'calibration', component: CalibrationPageComponent, canActivate: [authGuard] },
  { path: '' , component: TestPageComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent },
];
