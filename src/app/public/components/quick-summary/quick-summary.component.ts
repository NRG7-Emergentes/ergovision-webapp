import {Component, inject} from '@angular/core';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quick-summary',
  imports: [
    ZardButtonComponent
  ],
  template: `
    <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full mb-8">
      <div class="flex justify-between items-center">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-8 flex-1">
          <div class="flex flex-col">
            <span class="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium"> welcome </span>
            <span class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight"> Hello, Neo! </span>
          </div>
          <div class="flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-background/50 border border-border">
            <span class="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium"> last session </span>
            <span class="text-4xl font-bold text-primary">82%</span>
          </div>

          <div class="flex flex-col justify-center gap-4">
            <div class="flex items-center gap-2">
              <i class="icon-trending-up mr-1 w-5 h-5 text-emerald-400"></i>
              <span class="text-sm font-semibold text-foreground">Improving</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-2xl" aria-hidden="true">
                🔥
              </span>
              <div>
                <p class="text-xs text-muted-foreground uppercase tracking-widest font-medium">Current Streak</p>
                <p class="text-lg font-bold text-foreground">5 days</p>
              </div>
            </div>
          </div>

        </div>
        <button z-button zType="default" zSize="lg" (click)="goToMonitoring()">
          <i class="icon-play ml-1"></i>
          Start Monitoring
        </button>
      </div>
    </div>
  `,
  styles: ``
})
export class QuickSummaryComponent {

  private router = inject(Router);

  goToMonitoring(){
    this.router.navigate(['/monitoring/start']);
  }
}
