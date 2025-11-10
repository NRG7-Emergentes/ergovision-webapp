import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ErgovisionLogoComponent} from '@shared/components/ergovision-logo/ergovision-logo.component';
import {AuthService} from "@app/iam/services/auth.service";
import {ZardCardComponent} from '@shared/components/card/card.component';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from '@shared/components/form/form.component';
import {ZardCheckboxComponent} from '@shared/components/checkbox/checkbox.component';
import {ZardInputDirective} from '@shared/components/input/input.directive';
import {BaseFormComponent} from "@shared/components/base-form.component";
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterModule, ErgovisionLogoComponent, ZardCardComponent, ReactiveFormsModule, ZardButtonComponent, ZardFormControlComponent, ZardFormLabelComponent, ZardFormFieldComponent, ZardCheckboxComponent, ZardInputDirective],
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
            <form [formGroup]="form" class="space-y-4 sm:space-y-6 ">
              <z-form-field>
                <z-form-label [zRequired]="true">Email</z-form-label>
                <z-form-control>
                  <input id="email" z-input type="email" formControlName="username" placeholder="name@zard.com" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <z-form-field>
                <z-form-label [zRequired]="true">Password</z-form-label>
                <z-form-control>
                  <input id="password" z-input type="password" formControlName="password" placeholder="••••••••" class="w-full"/>
                </z-form-control>
              </z-form-field>

              <div class="flex items-center gap-2">
                <z-checkbox id="remember" formControlName="rememberMe"></z-checkbox>
                <label for="remember" class="text-sm cursor-pointer select-none">Remember me for 30 days</label>
              </div>

              <button type="submit" z-button zFull (click)="onSubmit()">Sign in</button>
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

///this.router.navigate(['/dashboard', '123']);
export class SignInComponent extends BaseFormComponent implements OnInit{
  form!: FormGroup;
  submitted = false;

  constructor(private builder: FormBuilder, private authenticationService: AuthService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid)
      return;
    let username = this.form.value.username;
    let password = this.form.value.password;
    const signInRequest = new SignInRequest(username, password);
    this.authenticationService.signIn(signInRequest);
    this.submitted = true;
  }

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }


}
