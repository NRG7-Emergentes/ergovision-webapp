import {Component, inject} from '@angular/core';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    ZardButtonComponent
  ],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8 h-full">
      <div class="h-full flex flex-col items-center justify-center gap-6">
        <div class="text-center">
          <h1 class="text-5xl sm:text-6xl font-bold text-foreground tracking-tight">Page Not Found</h1>
          <p class="text-muted-foreground mt-2"> nothing here, go home buddy</p>
        </div>
        <div>
          <button z-button zType="default" zSize="lg" (click)="goToDashboard()"> Go to Dashboard </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class NotFoundComponent {

  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/dashboard/un-id-monse']);
  }

}
