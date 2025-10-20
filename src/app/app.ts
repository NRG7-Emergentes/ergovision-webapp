import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject, OnInit } from '@angular/core';
import { DarkModeService } from '@shared/services/darkMode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
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
