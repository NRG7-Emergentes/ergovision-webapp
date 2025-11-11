import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ErgovisionLogoComponent } from '@shared/components/ergovision-logo/ergovision-logo.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import {ZardFormControlComponent, ZardFormFieldComponent, ZardFormLabelComponent} from '@shared/components/form/form.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { BaseFormComponent } from '@shared/components/base-form.component';
import { AuthService } from '@app/iam/services/auth.service';
import { SignUpRequest } from '@app/iam/domain/model/sign-up.request';

type RoleOption = {
  value: string;
  label: string;
  description: string;
};

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ErgovisionLogoComponent, ZardCardComponent, ZardButtonComponent, ZardCheckboxComponent, ZardFormControlComponent, ZardFormFieldComponent, ZardFormLabelComponent, ZardInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 min-h-dvh">
      <div class="flex items-center justify-center bg-gradient-to-br from-primary to-accent/10">
        <div class="text-center text-primary-foreground p-8">
          <app-ergovision-logo [size]="300"/>
          <h1 class="text-4xl font-bold mb-4">ErgoVision</h1>
          <p class="text-primary-foreground/80 text-lg">Tu visión de la ergonomía en un solo lugar</p>
        </div>
      </div>
      <div class="flex items-center justify-center p-8 bg-background">
        <div class="w-full max-w-md space-y-8">
          <div class="text-center">
            <h1 class="text-2xl font-bold sm:text-3xl">Sign Up</h1>
            <p class="mt-2 text-sm text-muted-foreground sm:text-base">Create an account</p>
          </div>

          <z-card class="p-4 sm:p-6 lg:p-8">
            <form [formGroup]="form" class="space-y-4 sm:space-y-6" (ngSubmit)="onSubmit()">

              <!-- Información Personal -->
              <div class="grid grid-cols-2 gap-4">
                <z-form-field>
                  <z-form-label [zRequired]="true">Name</z-form-label>
                  <z-form-control>
                    <input z-input type="text" formControlName="name" placeholder="John" class="w-full"/>
                  </z-form-control>
                  @if (form.get('name')?.invalid && form.get('name')?.touched) {
                    <div class="text-red-500 text-sm mt-1">
                      <span>Name is required</span>
                    </div>
                  }
                </z-form-field>

                <z-form-field>
                  <z-form-label [zRequired]="true">Last Name</z-form-label>
                  <z-form-control>
                    <input z-input type="text" formControlName="lastName" placeholder="Doe" class="w-full"/>
                  </z-form-control>
                  @if (form.get('lastName')?.invalid && form.get('lastName')?.touched) {
                    <div class="text-red-500 text-sm mt-1">
                      <span>Last name is required</span>
                    </div>
                  }
                </z-form-field>
              </div>

              <!-- Credenciales -->
              <z-form-field>
                <z-form-label [zRequired]="true">Email</z-form-label>
                <z-form-control>
                  <input z-input type="email" formControlName="username" placeholder="name@zard.com" class="w-full"/>
                </z-form-control>
                @if (form.get('username')?.invalid && form.get('username')?.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (form.get('username')?.errors?.['required']) {
                      <span>Email is required</span>
                    }
                    @if (form.get('username')?.errors?.['email']) {
                      <span>Please enter a valid email</span>
                    }
                  </div>
                }
              </z-form-field>

              <z-form-field>
                <z-form-label [zRequired]="true">Password</z-form-label>
                <z-form-control>
                  <input z-input type="password" formControlName="password" placeholder="••••••••" class="w-full"/>
                </z-form-control>
                @if (form.get('password')?.invalid && form.get('password')?.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (form.get('password')?.errors?.['required']) {
                      <span>Password is required</span>
                    }
                    @if (form.get('password')?.errors?.['minlength']) {
                      <span>Password must be at least 6 characters</span>
                    }
                  </div>
                }
              </z-form-field>

              <div class="grid grid-cols-3 gap-4">
                <z-form-field>
                  <z-form-label>Age</z-form-label>
                  <z-form-control>
                    <input z-input type="number" formControlName="age" placeholder="25" class="w-full" min="0" max="120"/>
                  </z-form-control>
                  @if (form.get('age')?.invalid && form.get('age')?.touched) {
                    <div class="text-red-500 text-sm mt-1">
                      @if (form.get('age')?.errors?.['min']) {
                        <span>Age must be positive</span>
                      }
                    </div>
                  }
                </z-form-field>

                <z-form-field>
                  <z-form-label>Height (cm)</z-form-label>
                  <z-form-control>
                    <input z-input type="number" formControlName="height" placeholder="175" class="w-full" step="0.1" min="0"/>
                  </z-form-control>
                  @if (form.get('height')?.invalid && form.get('height')?.touched) {
                    <div class="text-red-500 text-sm mt-1">
                      @if (form.get('height')?.errors?.['min']) {
                        <span>Height must be positive</span>
                      }
                    </div>
                  }
                </z-form-field>

                <z-form-field>
                  <z-form-label>Weight (kg)</z-form-label>
                  <z-form-control>
                    <input z-input type="number" formControlName="weight" placeholder="70" class="w-full" step="0.1" min="0"/>
                  </z-form-control>
                  @if (form.get('weight')?.invalid && form.get('weight')?.touched) {
                    <div class="text-red-500 text-sm mt-1">
                      @if (form.get('weight')?.errors?.['min']) {
                        <span>Weight must be positive</span>
                      }
                    </div>
                  }
                </z-form-field>
              </div>

              <z-form-field>
                <z-form-label>Image URL</z-form-label>
                <z-form-control>
                  <input z-input type="url" formControlName="imageUrl" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <!-- Términos y Condiciones -->
              <div class="flex items-center gap-2">
                <z-checkbox id="terms" formControlName="terms"></z-checkbox>
                <label for="terms" class="text-sm cursor-pointer select-none">Accept terms and conditions</label>
              </div>
              @if (form.get('terms')?.invalid && form.get('terms')?.touched) {
                <div class="text-red-500 text-sm mt-1">
                  <span>You must accept the terms and conditions</span>
                </div>
              }

              <!-- Botón de Submit -->
              <button
                type="submit"
                z-button
                zFull
                [disabled]="form.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                } @else {
                  <span>Sign Up</span>
                }
              </button>
            </form>
          </z-card>

          <p class="text-center text-sm text-muted-foreground">
            Already have an account?
            <a z-button zType="link" href="/sign-in" class="px-0">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class SignUpComponent extends BaseFormComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  isLoading = signal(false);

  private readonly builder = inject(FormBuilder);
  private readonly authenticationService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, [Validators.min(0)]],
      height: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(0)]],
      imageUrl: [''],
      selectedRole: ['ROLE_USER', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isLoading.set(true);

    const formValue = this.form.value;
    const signUpRequest = new SignUpRequest(
      formValue.username,
      formValue.password,
      [formValue.selectedRole],
      formValue.name,
      formValue.lastName,
      formValue.age,
      formValue.height,
      formValue.weight,
      formValue.imageUrl
    );

    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  navigateToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }
}
