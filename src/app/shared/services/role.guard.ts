import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../iam/services/auth.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthService);

  const expectedRole = route.data?.['expectedRole'];

  return authenticationService.currentUserRole.pipe(
    take(1),
    map(userRole => {
      if (!expectedRole || !userRole) {
        console.error('expectedRole o userRole no están definidos');
        router.navigate(['/sign-in']);
        return false;
      }

      if (userRole === expectedRole) {
        return true;
      }

      console.warn(`Access denied. Required role: ${expectedRole}, but user has: ${userRole}`);
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};
