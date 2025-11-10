import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ZardProgressBarComponent} from '@shared/components/progress-bar/progress-bar.component';
import {HistoryService, SessionDetail} from '@app/history/services/history.service';

@Component({
  selector: 'app-session-page',
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Session ID: {{ id }}</h1>
        <p class="text-muted-foreground mt-2">Overview of the monitoring session</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2  gap-4 ">
        <div class="bg-card border p-6 rounded-lg shadow-sm text-card-foreground w-full flex items-center justify-between">
          <span class="text-md font-medium tracking-widest text-muted-foreground text-xl"> Date (local timezone) </span>
          <div class="bg-background border rounded-full px-4 py-2 ">
            <span class="font-bold text-2xl"> 2025-10-20 </span>
          </div>
        </div>
        <div class="bg-card border p-6 rounded-lg shadow-sm text-card-foreground w-full flex items-center justify-between">
          <span class="text-md font-medium tracking-widest text-muted-foreground text-xl"> Session Time </span>
          <div class="bg-background border rounded-full px-4 py-2 ">
            <span class="font-bold text-2xl"> 01:30:00 </span>
          </div>
        </div>
        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <p class="text-xl font-bold mb-4"> Posture</p>
          <div class="flex flex-col gap-4">
            <div>
              <div class="mb-2 flex justify-between items-center">
                <span class="text-md font-medium tracking-widest"> Good Posture </span>
                <span> 80% </span>
              </div>
              <z-progress-bar [progress]="80"  zType="constructive"></z-progress-bar>
              <div class="mt-2">
                <span class="text-muted-foreground text-sm"> Time in Good Posture: 01:12:00</span>
              </div>
            </div>
            <div>
              <div class="mb-2 flex justify-between items-center">
                <span class="text-md font-medium tracking-widest"> Bad Posture </span>
                <span> 20% </span>
              </div>
              <z-progress-bar [progress]="20"  zType="destructive"></z-progress-bar>
              <div class="mt-2">
                <span class="text-muted-foreground text-sm"> Time in Bad Posture: 00:18:00</span>
              </div>
            </div>
          </div>

        </div>
        <div class="bg-card block border p-6 rounded-lg shadow-sm text-card-foreground w-full">
          <p class="text-xl font-bold mb-4"> Pauses</p>
          <div class="flex flex-col gap-4  mb-2 ">
            <div class="p-4 bg-secondary rounded-lg flex items-center justify-between">
              <span class="font-medium tracking-widest">Number of Pauses:</span>
              <span class="text-muted-foreground tracking-widest">3 Pauses</span>
            </div>
            <div class="p-4 bg-secondary rounded-lg flex items-center justify-between">
              <span class="font-medium tracking-widest">Average Pause Time:</span>
              <span class="text-muted-foreground tracking-widest">00:03:30</span>
            </div>
          </div>
          <span class="text-muted-foreground text-sm"> Note: pauses are detected when inactivity > threshold. </span>
        </div>
      </div>
    </div>
  `,
  styles: [``],
  imports: [
    ZardProgressBarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionPageComponent implements OnInit {
  id: string | null = null;
  session = signal<SessionDetail | undefined>(undefined);

  // reuse same mock as MetricsCards fallback if needed (kept internal only)
  readonly mock: SessionDetail = {
    id: 'mock',
    date: '2025-10-20',
    duration: '01:00:00',
    posture: { goodPercent: 75, badPercent: 25, goodTime: '00:45:00', badTime: '00:15:00' },
    pauses: { count: 2, avgTime: '00:04:30' }
  };

  private route = inject(ActivatedRoute);
  private svc = inject(HistoryService);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.svc.getSession(this.id).subscribe(s => this.session.set(s));
    }
  }
}
