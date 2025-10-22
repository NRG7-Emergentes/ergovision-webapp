import { Component } from '@angular/core';
import {ProfileMenuComponent} from '@app/public/components/profile-menu/profile-menu.component';
import {ZardMenuModule} from '@shared/components/menu/menu.module';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';

@Component({
  selector: 'app-navbar',
  imports: [
    ProfileMenuComponent,
    ZardMenuModule,
    ZardButtonComponent,
    ErgovisionLogoComponent
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
            <div class="relative">
              <button z-button zType="ghost" class="text-muted-foreground" >
                Dashboard
              </button>

              <button z-button zType="ghost" class="text-muted-foreground">
                Monitoring
              </button>

              <button z-button zType="ghost" class="text-muted-foreground">
                Progress
              </button>


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
