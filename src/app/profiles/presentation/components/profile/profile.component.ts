import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background text-foreground font-inter p-6">
      <div class="max-w-2xl mx-auto">
        <!-- Encabezado-->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p class="text-muted-foreground">Manage your personal information</p>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div class="p-6">

            <div class="flex items-center justify-between mb-6">
              <!--El Avatar-->
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-bold border-2 border-sidebar-border">
                  {{ user.name.charAt(0) }}{{ user.lastName.charAt(0) }}
                </div>
                <div>
                  <h2 class="text-xl font-bold text-card-foreground">{{ user.name }} {{ user.lastName }}</h2>
                  <p class="text-sm text-muted-foreground">Age: {{ user.age }} years old</p>
                </div>
              </div>

              <!--Bonton de Editar-->
              <button (click)="toggleEdit()"
                      class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
                {{ isEditing ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>

            <!--Detalles del perfil-->
            <div [ngSwitch]="isEditing" class="space-y-4">

              <!--Formulario para editar-->
              <form *ngSwitchCase="true" (ngSubmit)="saveProfile()" class="space-y-4">
                <!--Nombre-->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input type="text" [(ngModel)]="editedUser.name" name="name"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>

                  <!--Apellido-->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input type="text" [(ngModel)]="editedUser.lastName" name="lastName"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>
                </div>

                <!---->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Edad -->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Age</label>
                    <input type="number" [(ngModel)]="editedUser.age" name="age" min="0" max="120"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>

                  <!-- Altura -->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                    <input type="number" [(ngModel)]="editedUser.height" name="height" min="0" max="250"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>

                  <!-- Peso -->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                    <input type="number" [(ngModel)]="editedUser.weight" name="weight" min="0" max="300" step="0.1"
                           class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="flex gap-3 justify-end pt-4">
                  <button type="button" (click)="cancelEdit()"
                          class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                    Cancel
                  </button>
                  <button type="submit"
                          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Save Changes
                  </button>
                </div>
              </form>


              <div *ngSwitchCase="false" class="space-y-4">
                <!-- Información Personal -->
                <div class="bg-sidebar rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-sidebar-foreground mb-3 flex items-center gap-2">
                    <i class="lucide lucide-user w-5 h-5"></i>
                    Personal Information
                  </h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Nombre Completo-->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Full Name</label>
                      <p class="text-foreground font-medium">{{ user.name }} {{ user.lastName }}</p>
                    </div>

                    <!-- Edad-->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Age</label>
                      <p class="text-foreground font-medium">{{ user.age }} years old</p>
                    </div>

                    <!-- Altura-->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Height</label>
                      <p class="text-foreground font-medium">{{ user.height }} cm</p>
                    </div>

                    <!-- Peso-->
                    <div class="space-y-1">
                      <label class="text-sm text-muted-foreground">Weight</label>
                      <p class="text-foreground font-medium">{{ user.weight }} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ProfileComponent {
  user = {
    name: 'Carlos',
    lastName: 'García López',
    age: 28,
    height: 175,
    weight: 70.5
  };

  isEditing = false;
  editedUser = { ...this.user };

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile() {
    this.user = { ...this.editedUser };
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }


}
