import { Component, inject } from '@angular/core';
import {ZardDropdownModule} from '@shared/components/dropdown/dropdown.module';
import {ZardAvatarComponent} from '@shared/components/avatar/avatar.component';
import { Router } from '@angular/router';
import {AuthService} from '@app/iam/services/auth.service';

@Component({
  selector: 'app-profile-menu',
  imports: [ZardDropdownModule, ZardAvatarComponent],
  template: `
    <div>
      <div class="flex items-center gap-4 py-2 px-4 rounded-md hover:bg-accent/50 hover:text-accent-foreground bg-card border p-6 shadow-sm text-card-foreground transition-colors" z-dropdown [zDropdownMenu]="menu">
        <z-avatar [zImage]="{fallback: 'Y'}" class="w-8 h-8" />
        Your Name
      </div>
      <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
        <z-dropdown-menu-label>My Account</z-dropdown-menu-label>

        <z-dropdown-menu-item (click)="goToProfile()">
          <i class="icon-circle-user ml-1"></i>
          Profile
        </z-dropdown-menu-item>
        <z-dropdown-menu-item >
          <i class="icon-settings ml-1"></i>
          Settings
        </z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="goHistory()">
          <i class="icon-timer ml-1"></i>
          History
        </z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="logOut()">
          <i class="icon-log-out ml-1"></i>
          Logout
        </z-dropdown-menu-item>
      </z-dropdown-menu-content>
    </div>
  `,
  styles: ``
})
export class ProfileMenuComponent {
  private router = inject(Router);
  private readonly authService = inject(AuthService);

  logOut() {
    this.authService.logout();
    this.router.navigate(['sign-in']);
  }

  goHistory() {
    this.router.navigate(['history']);
  }
  goToProfile(): void {
    void this.router.navigate(['/profile']);
  }
}
