import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {StatsPageComponent} from '@app/stats/presentation/stats-page/stats-page.component';
import {MonitoringStartComponent} from '@app/monitoring/presentation/views/monitoring-start/monitoring-start.component';
import { HistoryPageComponent } from '@app/history/pages/history-page/history-page.component';
import { SessionPageComponent } from '@app/history/pages/session-page/session-page.component';
import {ProfileComponent} from '@app/iam/presentation/components/profile/profile.component';
import {SignInComponent} from '@app/iam/presentation/components/sign-in/sign-in.component';
import {SignUpComponent} from '@app/iam/presentation/components/sign-up/sign-up.component';
import {NotFoundComponent} from '@app/public/pages/not-found/not-found.component';
import { authenticationGuard } from '@app/iam/services/authentication.guard';
import { rootRedirectGuard } from '@app/iam/services/root-redirect.guard';
import {SettingsPageComponent} from '@app/orchestrator/pages/settings-page/settings-page.component';
import {CalibrationPageComponent} from '@app/orchestrator/pages/calibration-page/calibration-page.component';
import {MonitoringActiveComponent} from '@app/monitoring/presentation/views/monitoring-active/monitoring-active.component';

export const routes: Routes = [
  { path: '', canActivate: [rootRedirectGuard], children: [] },
  { path: 'dashboard/:id', component: MainDashboardComponent, canActivate: [authenticationGuard] },
  { path: 'progress/:id', component: StatsPageComponent, canActivate: [authenticationGuard] },
  { path: 'monitoring/start', component: MonitoringStartComponent, canActivate: [authenticationGuard] },
  { path: 'monitoring/active', component: MonitoringActiveComponent, canActivate: [authenticationGuard] },
  { path: 'history', component: HistoryPageComponent, canActivate: [authenticationGuard] },
  { path: 'history/:id', component: SessionPageComponent, canActivate: [authenticationGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard] },
  { path: 'settings' , component: SettingsPageComponent , canActivate: [authenticationGuard] },
  { path: 'calibration', component: CalibrationPageComponent, canActivate: [authenticationGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];
