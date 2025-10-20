import { Component } from '@angular/core';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-test-page',
  imports: [ZardButtonComponent],
  template: `
    <div class="w-full h-full flex flex-col gap-12 justify-center items-center text-center  ">
      <div>
        <h1 class="text-6xl font-bold tracking-tight leading-tight ">
          <span class="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">ErgoVision</span>
          <br> a solution for ur
          <span class="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
          damn
        </span> posture.
        </h1>
        <p class="text-white/70 text-xs mt-2">
          (ofc this is a test page, this will not be in the final product, just to have a pseudo-main page bf dashboard uk).
        </p>
      </div>
      <button z-button zSize="lg"
              (click)="goToDashboard()"
              class="bg-[#2B7FFF] text-white hover:bg-[#2B7FFF]/90">Go To Dashboard</button>
    </div>
  `,
  styles: ``
})
export class TestPageComponent {

  constructor(private router: Router) {
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/2d2631b8-0991-4934-a5a9-81c085d7f208']);
  }
}
