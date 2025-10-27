import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { DarkModeService } from '@shared/services/darkMode.service';
import {NavbarComponent} from '@app/public/components/navbar/navbar.component';
import {FooterComponent} from '@app/public/components/footer/footer.component';
import {ZardToastComponent} from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ZardToastComponent],
  template: `
    <div class="grid min-h-dvh grid-rows-[auto_1fr_auto] bg-background font-inter">
      <app-navbar/>
      <div class="">
        <router-outlet  />
        <z-toaster />
      </div>
      <app-footer/>
    </div>
  `,
  styles: `
  `
})
export class App {
  protected readonly title = signal('ergovision-frontend');

  private readonly darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    this.darkModeService.initTheme();
  }
}
