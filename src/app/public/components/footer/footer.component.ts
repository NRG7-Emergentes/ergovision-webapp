import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <a href="#" class="text-sm text-slate-400 hover:text-primary transition-colors"> Privacy Policy </a>
        <a href="#" class="text-sm text-slate-400 hover:text-primary transition-colors"> Terms of Service </a>
      </div>
      <p class="text-sm text-slate-400">
        © 2024 ErgoVision. All rights reserved.
      </p>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {

}
