import { Routes } from '@angular/router';
import {MaindashboardComponent} from '@app/public/pages/maindashboard/maindashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';

export const routes: Routes = [
  { path: 'dashboard/:id' , component: MaindashboardComponent},
  { path: '' , component: TestPageComponent }
];
