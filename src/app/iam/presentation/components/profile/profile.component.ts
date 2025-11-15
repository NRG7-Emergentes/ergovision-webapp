import {Component, inject, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {UserService} from '@app/iam/services/user.service';
import {User} from '@app/iam/domain/model/user.entity';
import {toast} from 'ngx-sonner';
import {UpdateUserRequest} from '@app/iam/domain/model/update-user.request';
import {ZardButtonComponent} from '@shared/components/button/button.component';
import {AuthenticationService} from '@app/iam/services/authentication.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ZardButtonComponent],
  template: `
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">My Profile</h1>
        <p class="text-muted-foreground mt-2">Manage your personal information</p>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
        <div class="p-6">

          <div class="flex items-center justify-between mb-6">
            <!--El Avatar-->
            <div class="flex items-center gap-4">
              @if (user().imageUrl) {
                <img [src]="user().imageUrl" alt="{{ user().username }}"
                     class="w-16 h-16 rounded-full border-2 border-sidebar-border object-cover">
              } @else {
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold border-2 border-sidebar-border">
                  {{ user().username.charAt(0).toUpperCase() }}
                </div>
              }
              <div>
                <h2 class="text-xl font-bold text-card-foreground">{{ user().username }}</h2>
              </div>
            </div>

            <!--Bonton de Editar-->
            @if (!isEditing()){
              <button (click)="toggleEdit()"
                      class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
                Edit Profile
              </button>
            }
          </div>

          <!--Detalles del perfil-->
          @switch (isEditing()) {
            @case (true) {
              <!--Formulario para editar-->
              <form (ngSubmit)="saveProfile()" class="space-y-4">
                <!--Email-->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input type="email" [(ngModel)]="editedUser().email" name="email"
                         class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                </div>

                <!--Image URL-->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Profile Image URL</label>
                  <input type="text" [(ngModel)]="editedUser().imageUrl" name="imageUrl"
                         class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                </div>

                <!--Age, Height, Weight-->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Age</label>
                    <input type="number" [(ngModel)]="editedUser().age" name="age" min="0" max="120"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                    <input type="number" [(ngModel)]="editedUser().height" name="height" min="0" max="250"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                    <input type="number" [(ngModel)]="editedUser().weight" name="weight" min="0" max="300" step="0.1"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="flex gap-3 justify-end pt-4">
                  <button type="button" (click)="cancelEdit()"
                          class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                    Cancel
                  </button>
                  <button z-button type="submit"
                          [zLoading]="isLoading()"
                          [disabled]="isLoading()"
                          class="px-4 py-2 text-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            }
            @case (false) {
              <div class="space-y-4">
                <!-- Información Personal -->
                <div class="bg-sidebar rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
                    <div class="aspect-square w-5 h-5 flex justify-center items-center">
                      <i class="icon-user"></i>
                    </div>
                    Personal Information
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Username -->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Username</label>
                      <p class="text-foreground font-medium">{{ user().username }}</p>
                    </div>

                    <!-- Email -->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Email</label>
                      <p class="text-foreground font-medium">{{ user().email }}</p>
                    </div>

                    <!-- Age -->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Age</label>
                      <p class="text-foreground font-medium">{{ user().age }} years old</p>
                    </div>

                    <!-- Height -->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Height</label>
                      <p class="text-foreground font-medium">{{ user().height }} cm</p>
                    </div>

                    <!-- Weight -->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Weight</label>
                      <p class="text-foreground font-medium">{{ user().weight }} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ProfileComponent implements OnInit{
  private userService = inject(UserService);
  private authService = inject(AuthenticationService);

  user = signal<User>({
    id: 0,
    username: '',
    email: '',
    imageUrl: '',
    age: 0,
    height: 0,
    weight: 0,
    roles: []
  });

  isEditing = signal(false);
  isLoading = signal(false);
  editedUser = signal<User>({ ...this.user() });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUserMe().subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.editedUser.set({ ...userData });
      },
      error: (_error) => {
        toast.error('Error loading user data');
      }
    });
  }

  toggleEdit() {
    this.isEditing.update(val => !val);
    if (this.isEditing()) {
      this.editedUser.set({ ...this.user() });
    }
  }

  saveProfile() {
    this.isLoading.set(true);

    const updateRequest = new UpdateUserRequest(
      this.editedUser().email,
      this.editedUser().imageUrl,
      this.editedUser().age,
      this.editedUser().height,
      this.editedUser().weight
    );

    this.userService.updateProfile(updateRequest).subscribe({
      next: (_response) => {
        // Update authentication service with new image URL
        this.authService.updateUserProfile(this.editedUser().imageUrl);

        // Reload user data to get the updated information from the server
        this.loadUserData();
        this.isEditing.set(false);
        this.isLoading.set(false);
        toast.success('Profile updated successfully');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoading.set(false);
        const errorMessage = error.error?.message || error.error?.error || 'Please try again later';
        toast.error('Failed to update profile', {
          description: errorMessage
        });
      }
    });
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

}
