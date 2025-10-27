import { Routes } from '@angular/router';
import {MainDashboardComponent} from '@app/public/pages/main-dashboard/main-dashboard.component';
import {TestPageComponent} from '@app/public/pages/test-page/test-page.component';
import {MonseCamComponent} from '@app/public/pages/monse-cam/monse-cam.component';
import {ProfileComponent} from '@app/profiles/presentation/components/profile/profile.component';
import {SignInComponent} from '@app/iam/presentation/components/sign-in/sign-in.component';
import {SignUpComponent} from '@app/iam/presentation/components/sign-up/sign-up.component';

export const routes: Routes = [


  { path: 'dashboard/:id' , component: MainDashboardComponent},
  {path: 'monse', component: MonseCamComponent},
  { path: 'sign-in', component: SignInComponent},
  { path: 'sign-up', component: SignUpComponent},
  {path: 'profile', component: ProfileComponent},
  { path: '' , component: TestPageComponent }
];
