import { Component } from '@angular/core';
import {ProfileMenuComponent} from '@app/public/components/profile-menu/profile-menu.component';
import {ZardMenuModule} from '@shared/components/menu/menu.module';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    ProfileMenuComponent,
    ZardMenuModule,
    ZardButtonComponent,
    ErgovisionLogoComponent,
    RouterLink
  ],
  template: `
    <header class="border-b">
      <div class="container mx-auto flex items-center h-18 justify-between px-4 sm:px-6 lg:px-8">

        <div class="flex items-center gap-16">
          <div class="flex items-center gap-3">
            <app-ergovision-logo [size]="36"/>
            <h1 class="text-xl font-bold"> ErgoVision </h1>
          </div>
          <nav>
            <div class="relative flex items-center gap-2">
              <a routerLink="/dashboard/1" z-button zType="ghost" class="text-muted-foreground">Dashboard</a>
              <a routerLink="/monitoring/start" z-button zType="ghost" class="text-muted-foreground">Monitoring</a>
              <a routerLink="/" z-button zType="ghost" class="text-muted-foreground">Progress</a>
            </div>
          </nav>
        </div>
        <app-profile-menu/>
      </div>
    </header>
  `,
  styles: ``
})
export class NavbarComponent {

}
