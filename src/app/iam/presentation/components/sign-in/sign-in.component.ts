import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';
import {AuthenticationService} from "@app/iam/services/authentication.service";
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {ZardCardComponent} from '@shared/components/card/card.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from '@shared/components/form/form.component';
import {ZardInputDirective} from '@shared/components/input/input.directive';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterModule, ErgovisionLogoComponent, ZardCardComponent, ReactiveFormsModule, ZardButtonComponent, ZardFormControlComponent, ZardFormLabelComponent, ZardFormFieldComponent, ZardInputDirective],
  template: `
    <div class="grid grid-cols-2 min-h-dvh">

      <div class="flex items-center justify-center bg-gradient-to-br from-primary to-accent/10">
        <div class="text-center text-primary-foreground p-8">
          <app-ergovision-logo [size]="300"/>
          <h1 class="text-4xl font-bold mb-4">ErgoVision</h1>
          <p class="text-primary-foreground/80 text-lg">Tu visión de la ergonomía en un solo lugar</p>
        </div>
      </div>

      <div class=" flex items-center justify-center p-8 bg-background">
        <div class="w-full max-w-md space-y-8">
          <div class="text-center">
            <h1 class="text-2xl font-bold sm:text-3xl">Sign In</h1>
            <p class="mt-2 text-sm text-muted-foreground sm:text-base">Sign in to your account to continue</p>
          </div>
          <z-card class="p-4 sm:p-6 lg:p-8 ">
            <form [formGroup]="loginForm" class="space-y-4 sm:space-y-6 ">
              <z-form-field>
                <z-form-label [zRequired]="true">Email</z-form-label>
                <z-form-control>
                  <input id="email" z-input type="email" formControlName="email" placeholder="name@zard.com" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <z-form-field>
                <z-form-label [zRequired]="true">Password</z-form-label>
                <z-form-control>
                  <input id="password" z-input type="password" formControlName="password" placeholder="••••••••" class="w-full"/>
                </z-form-control>
              </z-form-field>



              <button type="submit" z-button zFull (click)="onSubmit()"
                      [zLoading]="isLoading()" [disabled]="this.loginForm.invalid">Sign in</button>
            </form>
          </z-card>

          <p class="text-center text-sm text-muted-foreground">
            Don't have an account?
            <a z-button zType="link" href="/sign-up" class="px-0">Sign up</a>
          </p>

        </div>
      </div>


    </div>
  `,
  styles: ``
})
export class SignInComponent {

  protected readonly authService = inject(AuthenticationService);
  private router = inject(Router);
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
      return;
    }

    this.isLoading.set(true);

    const signInRequest = new SignInRequest(
      this.loginForm.value.email!,
      this.loginForm.value.password!
    );

    this.authService.signIn(signInRequest).subscribe({
      next: (response) => {

        toast.success('Sign-in successful');
        this.isLoading.set(false);
        // Navigation is handled by the service
      },
      error: (error) => {
        toast.error('Sign-in failed', {
          description: error.error.message
        })

        this.isLoading.set(false);

      }
    });
  }

}
