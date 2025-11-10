import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../iam/services/auth.service';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  if (authenticationService.isSignedIn ) {
    router.navigate(['/dashboard']); // Redirige si el usuario ya está autenticado
    return false;

  }
  return true; // permitir el acceso si no está autenticado XD

};
