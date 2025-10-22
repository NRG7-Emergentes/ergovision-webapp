import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-summary',
  imports: [],
  template: `
    <div class="mb-8">
      <p class="text-lg font-bold text-foreground mb-4 tracking-tight">Statistics Summary</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                last 7 days
              </span>
              <span class="text-sm font-semibold text-foreground ">Average Score</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-primary/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-chart-bar-big text-primary  "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">78.5</span>
            <span class="text-sm text-muted-foreground font-medium">%</span>
          </div>
        </div>



        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                this week
              </span>
              <span class="text-sm font-semibold text-foreground">Total Monitored Time</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-cyan-500/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-clock text-cyan-400 "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">4h 32m</span>
          </div>
        </div>


        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                main focus
              </span>
              <span class="text-sm font-semibold text-foreground ">Most Common Weak Point</span>
            </div>
            <div class="p-2.5 rounded-lg flex-shrink-0 bg-amber-500/10 " >
              <div class="aspect-square w-5 h-5 flex justify-center items-center">
                <i class="icon-triangle-alert text-amber-400  "></i>
              </div>
            </div>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-foreground">Shoulder</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StatsSummaryComponent {

}
