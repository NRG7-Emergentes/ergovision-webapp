import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MainDashboardComponent},
  { path: '' , component: TestPageComponent }
];
