import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {StatsPageComponent} from '@app/stats/presentation/stats-page/stats-page.component';
import {MonitoringStartComponent} from '@app/monitoring/presentation/views/monitoring-start/monitoring-start.component';
import { HistoryPageComponent } from '@app/history/pages/history-page/history-page.component';
import { SessionPageComponent } from '@app/history/pages/session-page/session-page.component';
import {ProfileComponent} from '@app/iam/presentation/components/profile/profile.component';
import {SignInComponent} from '@app/iam/presentation/components/sign-in/sign-in.component';
import {SignUpComponent} from '@app/iam/presentation/components/sign-up/sign-up.component';
import {NotFoundComponent} from '@app/public/pages/not-found/not-found.component';
import { authGuard } from '@app/iam/infrastructure/guards/auth.guard';
import {SettingsPageComponent} from '@app/orchestrator/pages/settings-page/settings-page.component';
import {CalibrationPageComponent} from '@app/orchestrator/pages/calibration-page/calibration-page.component';
import {MonitoringActiveComponent} from '@app/monitoring/presentation/views/monitoring-active/monitoring-active.component';

export const routes: Routes = [
  { path: 'dashboard/:id', component: MainDashboardComponent, canActivate: [authGuard] },
  { path: 'progress/:id', component: StatsPageComponent, canActivate: [authGuard] },
  { path: 'monitoring/start', component: MonitoringStartComponent, canActivate: [authGuard] },
  { path: 'monitoring/active', component: MonitoringActiveComponent, canActivate: [authGuard] },
  { path: 'history', component: HistoryPageComponent, canActivate: [authGuard] },
  { path: 'history/:id', component: SessionPageComponent, canActivate: [authGuard] },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings' , component: SettingsPageComponent , canActivate: [authGuard] },
  { path: 'calibration', component: CalibrationPageComponent, canActivate: [authGuard] },
  { path: '' , redirectTo: 'not-found', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent },
  { path: 'not-found', component: NotFoundComponent, canActivate: [authGuard] }
];
