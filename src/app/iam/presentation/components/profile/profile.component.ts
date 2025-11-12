import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '@app/iam/services/user.service';
import { SignUpResponse } from '@app/iam/domain/model/sign-up.response';
import { UpdateUserRequest } from '@app/iam/domain/model/update-user.request';

import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent
} from '@shared/components/form/form.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardFormControlComponent,
    ZardFormFieldComponent,
    ZardFormLabelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">My Profile</h1>
        <p class="text-muted-foreground mt-2">Manage your personal information</p>
      </div>

      @if (user()) {
        <z-card class="p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold border-2 border-sidebar-border">
                {{ user()!.name.charAt(0) }}{{ user()!.lastName.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-bold text-card-foreground">{{ user()!.name }} {{ user()!.lastName }}</h2>
                <p class="text-sm text-muted-foreground">Age: {{ user()!.age }} years old</p>
              </div>
            </div>

            <button z-button zVariant="secondary" (click)="toggleEdit()" [disabled]="isLoading()">{{ isEditing() ? 'Cancel' : 'Edit Profile' }}</button>
          </div>

          @if (isEditing()) {
            <form (ngSubmit)="saveProfile()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <z-form-field>
                  <z-form-label [zRequired]="true">Name</z-form-label>
                  <z-form-control>
                    <input z-input type="text" [(ngModel)]="editedUser.name" name="name" required placeholder="Enter your name">
                  </z-form-control>
                </z-form-field>

                <z-form-field>
                  <z-form-label [zRequired]="true">Last Name</z-form-label>
                  <z-form-control>
                    <input z-input type="text" [(ngModel)]="editedUser.lastName" name="lastName" required placeholder="Enter your last name">
                  </z-form-control>
                </z-form-field>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <z-form-field>
                  <z-form-label [zRequired]="true">Age</z-form-label>
                  <z-form-control>
                    <input z-input type="number" [(ngModel)]="editedUser.age" name="age" min="0" max="120" required placeholder="Age">
                  </z-form-control>
                </z-form-field>

                <z-form-field>
                  <z-form-label [zRequired]="true">Height (cm)</z-form-label>
                  <z-form-control>
                    <input z-input type="number" [(ngModel)]="editedUser.height" name="height" min="0" max="250" required placeholder="Height in cm">
                  </z-form-control>
                </z-form-field>

                <z-form-field>
                  <z-form-label [zRequired]="true">Weight (kg)</z-form-label>
                  <z-form-control>
                    <input z-input type="number" [(ngModel)]="editedUser.weight" name="weight" min="0" max="300" step="0.1" required placeholder="Weight in kg">
                  </z-form-control>
                </z-form-field>
              </div>

              <z-form-field>
                <z-form-label>Image URL</z-form-label>
                <z-form-control>
                  <input z-input type="url" [(ngModel)]="editedUser.imageUrl" name="imageUrl" placeholder="https://example.com/photo.jpg">
                </z-form-control>
              </z-form-field>

              <div class="flex gap-3 justify-end pt-4">
                <button type="button" z-button zVariant="outline" (click)="cancelEdit()" [disabled]="isLoading()">Cancel</button>
                <button type="submit" z-button [disabled]="isLoading()">{{ isLoading() ? 'Saving...' : 'Save Changes' }}</button>
              </div>
            </form>
          } @else {
            <div class="space-y-6">
              <z-card class="bg-sidebar rounded-lg p-6 border border-border">
                <h3 class="text-lg font-semibold text-sidebar-foreground mb-4 flex items-center gap-2">
                  <div class="aspect-square w-5 h-5 flex justify-center items-center">
                    <i class="icon-user"></i>
                  </div>
                  Personal Information
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <z-form-label>Full Name</z-form-label>
                    <p class="text-foreground font-medium text-base">{{ user()!.name }} {{ user()!.lastName }}</p>
                  </div>

                  <div class="space-y-2">
                    <z-form-label>Age</z-form-label>
                    <p class="text-foreground font-medium text-base">{{ user()!.age }} years old</p>
                  </div>

                  <div class="space-y-2">
                    <z-form-label>Height</z-form-label>
                    <p class="text-foreground font-medium text-base">{{ user()!.height }} cm</p>
                  </div>

                  <div class="space-y-2">
                    <z-form-label>Weight</z-form-label>
                    <p class="text-foreground font-medium text-base">{{ user()!.weight }} kg</p>
                  </div>
                </div>
              </z-card>
            </div>
          }
        </z-card>
      } @else if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <p class="text-muted-foreground">Loading profile...</p>
        </div>
      }
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);

  user = signal<SignUpResponse | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);

  editedUser: UpdateUserRequest = {
    name: '',
    lastName: '',
    age: 0,
    height: 0,
    weight: 0,
    imageUrl: ''
  };

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.isLoading.set(true);
    this.userService.getUserMe().subscribe({
      next: (data) => {
        this.user.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update(editing => !editing);
    if (this.isEditing()) {
      const currentUser = this.user();
      if (currentUser) {
        this.editedUser = {
          name: currentUser.name,
          lastName: currentUser.lastName,
          age: currentUser.age,
          height: currentUser.height,
          weight: currentUser.weight,
          imageUrl: currentUser.imageUrl
        };
      }
    }
  }

  saveProfile(): void {
    this.isLoading.set(true);
    this.userService.updateProfile(this.editedUser).subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.isEditing.set(false);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoading.set(false);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
}
