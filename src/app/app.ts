import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { DarkModeService } from '@shared/services/darkMode.service';
import {NavbarComponent} from '@app/public/components/navbar/navbar.component';
import {FooterComponent} from '@app/public/components/footer/footer.component';
import {ZardToastComponent} from '@shared/components/toast/toast.component';
import {AuthService} from '@app/iam/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ZardToastComponent],
  template: `
    <div class="grid min-h-dvh grid-rows-[auto_1fr_auto] font-inter">
      @if (authService.isAuthenticated()) {
        <app-navbar/>
      }
      <div class="">
        <router-outlet  />
        <z-toaster />
      </div>
      @if (authService.isAuthenticated()) {
        <app-footer/>
      }
    </div>
  `,
  styles: `
  `
})
export class App implements OnInit {
  protected readonly title = signal('ergovision-frontend');

  private readonly darkModeService = inject(DarkModeService);
  protected readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.darkModeService.initTheme();
  }
}
