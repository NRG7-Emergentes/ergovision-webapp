import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {map, take} from "rxjs";

export const authGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  return authenticationService.isSignedIn.pipe(
    take(1), map(isSignedIn => {
      if (isSignedIn)
        return true;
      else {
        router.navigate(['/sign-in']).then();
        return false;
      }
    })
  );
};

