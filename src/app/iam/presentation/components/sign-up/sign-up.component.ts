import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule, ErgovisionLogoComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground font-inter flex">
      <!-- Left Side - Logo and Brand -->
      <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-primary lg:to-accent">
        <div class="text-center text-primary-foreground p-8">

          <app-ergovision-logo [size]="300"/>

          <h1 class="text-4xl font-bold mb-4">ErgoVision</h1>
          <p class="text-primary-foreground/80 text-lg">Únete a nuestra comunidad ergonómica</p>
        </div>
      </div>

      <!-- Right Side - Registration Form -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-2xl">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex flex-col items-center justify-center mb-8">
            <app-ergovision-logo [size]="100" class="block mx-auto"></app-ergovision-logo>
            <h1 class="text-3xl font-bold text-primary mt-2">ErgoVision</h1>
          </div>

          <!-- Registration Card -->
          <div class="bg-card rounded-xl border border-border shadow-lg p-8">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-card-foreground">Create Account</h2>
              <p class="text-muted-foreground mt-2">Regístrate en ErgoVision</p>
            </div>

            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Personal Information Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Name -->
                <div>
                  <label for="firstName" class="block text-sm font-medium text-foreground mb-2">
                    Name *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-user absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="firstName"
                      type="text"
                      [(ngModel)]="userData.firstName"
                      name="firstName"
                      required
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Tu nombre"
                    >
                  </div>
                </div>

                <!-- Last Name -->
                <div>
                  <label for="lastName" class="block text-sm font-medium text-foreground mb-2">
                    Last Name *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-users absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="lastName"
                      type="text"
                      [(ngModel)]="userData.lastName"
                      name="lastName"
                      required
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Tu apellido"
                    >
                  </div>
                </div>
              </div>

              <!-- Username and Photo URL -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Username -->
                <div>
                  <label for="username" class="block text-sm font-medium text-foreground mb-2">
                    User *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-at-sign absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="username"
                      type="text"
                      [(ngModel)]="userData.username"
                      name="username"
                      required
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Nombre de usuario"
                    >
                  </div>
                </div>

                <!-- Photo URL -->
                <div>
                  <label for="photoUrl" class="block text-sm font-medium text-foreground mb-2">
                    Photo URL
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-image absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="photoUrl"
                      type="url"
                      [(ngModel)]="userData.photoUrl"
                      name="photoUrl"
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="https://ejemplo.com/foto.jpg"
                    >
                  </div>
                </div>
              </div>

              <!-- Age and Role -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Age -->
                <div>
                  <label for="age" class="block text-sm font-medium text-foreground mb-2">
                    Age *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-calendar absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="age"
                      type="number"
                      [(ngModel)]="userData.age"
                      name="age"
                      required
                      min="1"
                      max="120"
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Tu edad"
                    >
                  </div>
                </div>

                <!-- Role -->
                <div>
                  <label for="role" class="block text-sm font-medium text-foreground mb-2">
                    Role *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-briefcase absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <select
                      id="role"
                      [(ngModel)]="userData.role"
                      name="role"
                      required
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors appearance-none"
                    >
                      <option value="" disabled selected>Selecciona tu rol</option>
                      <option value="user">Student</option>
                      <option value="ergonomist">Profesional</option>
                    </select>
                    <i class="lucide lucide-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              <!-- Height and Weight -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Height -->
                <div>
                  <label for="height" class="block text-sm font-medium text-foreground mb-2">
                    Height (cm) *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-ruler absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="height"
                      type="number"
                      [(ngModel)]="userData.height"
                      name="height"
                      required
                      min="50"
                      max="250"
                      step="0.1"
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Estatura en cm"
                    >
                  </div>
                </div>

                <!-- Weight -->
                <div>
                  <label for="weight" class="block text-sm font-medium text-foreground mb-2">
                    Weight (kg) *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-weight absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="weight"
                      type="number"
                      [(ngModel)]="userData.weight"
                      name="weight"
                      required
                      min="1"
                      max="300"
                      step="0.1"
                      class="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Peso en kg"
                    >
                  </div>
                </div>
              </div>

              <!-- Passwords -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Password -->
                <div>
                  <label for="password" class="block text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="password"
                      [type]="showPassword ? 'text' : 'password'"
                      [(ngModel)]="userData.password"
                      name="password"
                      required
                      minlength="6"
                      class="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Mínimo 6 caracteres"
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

                <!-- Confirm Password -->
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-foreground mb-2">
                    Confirm Password *
                  </label>
                  <div class="relative">
                    <i class="lucide lucide-shield-check absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></i>
                    <input
                      id="confirmPassword"
                      [type]="showConfirmPassword ? 'text' : 'password'"
                      [(ngModel)]="userData.confirmPassword"
                      name="confirmPassword"
                      required
                      class="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      placeholder="Confirma tu contraseña"
                    >
                    <button
                      type="button"
                      (click)="toggleConfirmPasswordVisibility()"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <i [class]="showConfirmPassword ? 'lucide lucide-eye-off' : 'lucide lucide-eye'" class="w-4 h-4"></i>
                    </button>
                  </div>
                  <div *ngIf="userData.password && userData.confirmPassword && userData.password !== userData.confirmPassword"
                       class="text-destructive text-xs mt-1 flex items-center gap-1">
                    <i class="lucide lucide-alert-circle w-3 h-3"></i>
                    Las contraseñas no coinciden
                  </div>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start gap-3">
                <input
                  type="checkbox"
                  [(ngModel)]="userData.acceptTerms"
                  name="acceptTerms"
                  required
                  class="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring focus:ring-2 mt-1"
                >
                <label class="text-sm text-foreground">
                  Acepto los <a href="#" class="text-primary hover:text-primary/90 underline">términos y condiciones</a>
                  y la <a href="#" class="text-primary hover:text-primary/90 underline">política de privacidad</a> de ErgoVision
                </label>
              </div>

              <!-- Sign Up Button -->
              <button
                type="submit"
                [disabled]="isLoading || !passwordsMatch() || !userData.acceptTerms"
                class="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading" class="flex items-center justify-center gap-2">
                  <i class="lucide lucide-user-plus w-4 h-4"></i>
                  Sign Up
                </span>
                <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                  <i class="lucide lucide-loader-2 w-4 h-4 animate-spin"></i>
                  Creando cuenta...
                </span>
              </button>

              <!-- Divider -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-border"></div>
                </div>
              </div>

              <!-- Already have an account? -->
              <div class="text-center">
                <p class="text-sm text-muted-foreground">
                  ¿Already have an account?
                  <a
                    routerLink="/sign-in"
                    class="text-primary hover:text-primary/90 font-medium transition-colors ml-1"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class SignUpComponent {
  userData = {
    firstName: '',
    lastName: '',
    username: '',
    photoUrl: '',
    age: null as number | null,
    role: '',
    height: null as number | null,
    weight: null as number | null,
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    return this.userData.password === this.userData.confirmPassword;
  }

  onSubmit() {
    if (this.isLoading || !this.passwordsMatch() || !this.userData.acceptTerms) return;

    this.isLoading = true;

    // Simular proceso de registro
    setTimeout(() => {
      console.log('Registration data:', this.userData);

      this.isLoading = false;

    }, 2000);
  }
}
