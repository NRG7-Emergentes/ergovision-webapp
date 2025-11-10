import {Component, inject} from '@angular/core';
import {Z_MODAL_DATA} from '@shared/components/dialog/dialog.service';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-active-pause-dialog',
  imports: [
    NgOptimizedImage
  ],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Active Pause</h1>
        <p class="text-muted-foreground mt-2">Take a break :D</p>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div
          class="bg-card border p-6 rounded-lg shadow-sm text-card-foreground w-full flex justify-between items-center">
          <h2 class="text-xl font-bold text-foreground -tracking-normal">Pause Time: </h2>
          <span class="text-xl font-bold text-foreground  -tracking-normal"> 00:05:42 </span>
        </div>
        <div
          class="bg-card border p-6 rounded-lg shadow-sm text-card-foreground w-full flex justify-between items-center">
          <h2 class="text-xl font-bold text-foreground  -tracking-normal">Pauses Taken: </h2>
          <span class="text-xl font-bold text-foreground  -tracking-normal"> 3 </span>
        </div>
      </div>

      <div class="mb-2">
        <h2 class="text-2xl font-medium text-foreground  -tracking-normal"> Exercises </h2>
        <p class="text-muted-foreground ">stretch or take a walk, try not to just sit</p>
      </div>

      <div class="grid grid-cols-3 gap-4 ">
        <div class="bg-card rounded-2xl p-4 overflow-hidden flex flex-col">
          <div class="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg mb-3">
            <img ngSrc="/assets/calf.webp" alt="Calf exercise" width="170" height="100" class="object-contain max-w-full max-h-full">
          </div>
          <h3 class="text-lg font-semibold text-foreground mb-1">Calf Raises</h3>
          <p class="text-sm text-muted-foreground">Stand and raise your heels off the ground, then lower them back down. Repeat 15 times.</p>
        </div>

        <div class="bg-card rounded-2xl p-4 overflow-hidden flex flex-col">
          <div class="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg mb-3">
            <img ngSrc="/assets/cuadriceps.webp" alt="Quadriceps exercise" width="170" height="200" class="object-contain max-w-full max-h-full">
          </div>
          <h3 class="text-lg font-semibold text-foreground mb-1">Quadriceps Stretch</h3>
          <p class="text-sm text-muted-foreground">Stand on one leg, pull your other foot toward your glutes. Hold for 30 seconds each side.</p>
        </div>

        <div class="bg-card rounded-2xl p-4 overflow-hidden flex flex-col">
          <div class="w-full h-48 flex items-center justify-center bg-muted/20 rounded-lg mb-3">
            <img ngSrc="/assets/walk.webp" alt="Walk exercise" width="100" height="100" class="object-contain max-w-full max-h-full">
          </div>
          <h3 class="text-lg font-semibold text-foreground mb-1">Walk Around</h3>
          <p class="text-sm text-muted-foreground">Take a short walk around your workspace to improve circulation and reduce stiffness.</p>
        </div>
      </div>


    </div>
  `,
  styles: ``,
})
export class ActivePauseDialogComponent {

  private zData = inject(Z_MODAL_DATA);

}
