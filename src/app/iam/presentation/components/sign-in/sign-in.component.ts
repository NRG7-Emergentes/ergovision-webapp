import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';
import {AuthService} from "@app/iam/services/auth.service";

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterModule, ErgovisionLogoComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground font-inter flex">
      <!-- Left Side - Logo and Brand -->
      <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-primary lg:to-accent">
        <div class="text-center text-primary-foreground p-8">
          <app-ergovision-logo [size]="300"/>
          <h1 class="text-4xl font-bold mb-4">ErgoVision</h1>
          <p class="text-primary-foreground/80 text-lg">Tu visión de la ergonomía en un solo lugar</p>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex flex-col items-center justify-center mb-8">
            <app-ergovision-logo [size]="100" class="block mx-auto"></app-ergovision-logo>
            <h1 class="text-3xl font-bold text-primary mt-2">ErgoVision</h1>
          </div>

          <!-- Login Card -->
          <div class="bg-card rounded-xl border border-border shadow-lg p-8">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-card-foreground">Sign In</h2>
              <p class="text-muted-foreground mt-2">Accede a tu cuenta de ErgoVision</p>
            </div>

            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Username/Email Field -->
              <div>
                <label for="username" class="block text-sm font-medium text-foreground mb-2">
                  Usuario o Email
                </label>
                <div class="relative">
                  <i class="lucide lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                  <input
                    id="username"
                    type="text"
                    [(ngModel)]="credentials.username"
                    name="username"
                    required
                    class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    placeholder="Ingresa tu usuario o email"
                  >
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-foreground mb-2">
                  Contraseña
                </label>
                <div class="relative">
                  <i class="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                  <input
                    id="password"
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="credentials.password"
                    name="password"
                    required
                    class="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    placeholder="Ingresa tu contraseña"
                  >
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <i [class]="showPassword ? 'lucide lucide-eye-off' : 'lucide lucide-eye'" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Remember Me Checkbox -->
              <div class="flex items-center justify-between">
                <label class="flex items-center text-sm text-foreground">
                  <input
                    type="checkbox"
                    [(ngModel)]="credentials.rememberMe"
                    name="rememberMe"
                    class="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring focus:ring-2"
                  >
                  <span class="ml-2">Recordar sesión</span>
                </label>
              </div>

              <!-- Sign In Button -->
              <button
                type="submit"
                [disabled]="isLoading"
                class="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading" class="flex items-center justify-center gap-2">
                  <i class="lucide lucide-log-in w-4 h-4"></i>
                  Sign In
                </span>
                <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                  <i class="lucide lucide-loader-2 w-4 h-4 animate-spin"></i>
                  Iniciando sesión...
                </span>
              </button>

              <!-- Divider -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-border"></div>
                </div>
              </div>

              <!-- Links Section -->
              <div class="space-y-4 text-center">
                <!-- Don't have an account? -->
                <div>
                  <p class="text-sm text-muted-foreground">
                    ¿Don't have an account?
                    <a
                      routerLink="/sign-up"
                      class="text-primary hover:text-primary/90 font-medium transition-colors ml-1"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>

                <!-- Forgot Password? -->
                <div>
                  <p class="text-sm text-muted-foreground">
                    ¿Forgot Your Password?
                    <a
                      routerLink="/recover-password"
                      class="text-primary hover:text-primary/90 font-medium transition-colors ml-1"
                    >
                      Recover Password
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class SignInComponent {

  protected readonly authService = inject(AuthService);
  private router = inject(Router);


  credentials = {
    username: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.authService.login();

    if ( this.authService.isAuthenticated()){
      this.router.navigate(['/dashboard', 'monse-pi']);
    }

  }
}
