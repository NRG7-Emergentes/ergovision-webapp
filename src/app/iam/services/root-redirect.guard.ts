import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@app/iam/services/authentication.service';

export const rootRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isSignedIn()) {
    const userId = authService.getToken();
    return router.createUrlTree(['/dashboard', userId]);
  }

  return router.createUrlTree(['/sign-in']);
};

