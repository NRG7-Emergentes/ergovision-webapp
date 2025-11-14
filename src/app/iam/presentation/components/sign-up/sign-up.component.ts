import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {SignUpRequest} from '@app/iam/domain/model/sign-up.request';
import {ZardCardComponent} from '@shared/components/card/card.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {ZardCheckboxComponent} from '@shared/components/checkbox/checkbox.component';

import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from '@shared/components/form/form.component';
import {ZardInputDirective} from '@shared/components/input/input.directive';
import {onlyNumbersValidator} from '@shared/utils/number.validator';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule, ErgovisionLogoComponent, ZardCardComponent, ReactiveFormsModule, ZardButtonComponent, ZardCheckboxComponent, ZardFormControlComponent, ZardFormFieldComponent, ZardFormLabelComponent, ZardInputDirective],
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
            <h1 class="text-2xl font-bold sm:text-3xl">Sign Up</h1>
            <p class="mt-2 text-sm text-muted-foreground sm:text-base">create an account</p>
          </div>

          <z-card class="p-4 sm:p-6 lg:p-8">
            <form [formGroup]="signUpForm" class="space-y-4 sm:space-y-6">

              <z-form-field>
                <z-form-label [zRequired]="true">Username</z-form-label>
                <z-form-control>
                  <input z-input type="text" formControlName="username" placeholder="user01" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <z-form-field>
                <z-form-label [zRequired]="true">Email</z-form-label>
                <z-form-control>
                  <input z-input type="email" formControlName="email" placeholder="name@zard.com" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <div class="grid grid-cols-2 gap-4">


                <z-form-field>
                  <z-form-label [zRequired]="true">Image Url</z-form-label>
                  <z-form-control>
                    <input z-input type="url" formControlName="img" placeholder="https://img.com/image.webp" class="w-full"/>
                  </z-form-control>
                </z-form-field>

                <z-form-field>
                  <z-form-label [zRequired]="true" >Age</z-form-label>
                  <z-form-control>
                    <input z-input type="number" formControlName="age" placeholder="19" class="w-full"/>
                  </z-form-control>
                </z-form-field>
              </div>

              <div class="grid grid-cols-2 gap-4">


                <z-form-field>
                  <z-form-label [zRequired]="true" >Height</z-form-label>
                  <z-form-control>
                    <input z-input type="text" formControlName="height" placeholder="in cm" class="w-full"/>
                  </z-form-control>
                </z-form-field>


                <z-form-field>
                  <z-form-label [zRequired]="true" >Weight</z-form-label>
                  <z-form-control>
                    <input z-input type="text" formControlName="weight" placeholder="in kg" class="w-full"/>
                  </z-form-control>
                </z-form-field>
              </div>

              <z-form-field>
                <z-form-label [zRequired]="true" >Password</z-form-label>
                <z-form-control>
                  <input z-input type="password" formControlName="password" placeholder="••••••••" class="w-full"/>
                </z-form-control>
              </z-form-field>


              <div class="flex items-center gap-2">
                <z-checkbox id="terms" formControlName="terms"></z-checkbox>
                <label for="terms" class="text-sm cursor-pointer select-none">Accept terms and conditions </label>
              </div>

              <button type="submit" z-button zFull (click)="onSubmit()"
                      [zLoading]="isLoading()" [disabled]="this.signUpForm.invalid">Sign up</button>
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
export class SignUpComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  protected readonly isLoading = signal(false);

  protected readonly signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    img: new FormControl('', [
      Validators.required,
      Validators.pattern('^https?://.*\\..+')
    ]),

    age: new FormControl('', [
      Validators.required,
      onlyNumbersValidator(),
      Validators.min(1),
      Validators.max(120)
    ]),

    height: new FormControl('', [
      Validators.required,
      onlyNumbersValidator(),
      Validators.min(50),
      Validators.max(300)
    ]),

    weight: new FormControl('', [
      Validators.required,
      onlyNumbersValidator(),
      Validators.min(1),
      Validators.max(500)
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    terms: new FormControl(false , [
      Validators.requiredTrue
    ]),
  });


  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.signUpForm.updateValueAndValidity();
      return;
    }

    this.isLoading.set(true);

    const signUpRequest = new SignUpRequest(
      this.signUpForm.value.username!,
      this.signUpForm.value.email!,
      this.signUpForm.value.password!,
      this.signUpForm.value.img!,
      Number(this.signUpForm.value.age!),
      Number(this.signUpForm.value.height!),
      Number(this.signUpForm.value.weight!),
      ['ROLE_USER']
    );

    this.authService.signUp(signUpRequest).subscribe({
      next: (response) => {
        toast.success('Sign-up successful');
        this.isLoading.set(false);
        this.router.navigate(['/sign-in']).then();
      },

      error: (error) => {
        toast.error('Sign-up failed', {
          description: error.error.message
        });
        this.isLoading.set(false);

      }
    });
  }
}
