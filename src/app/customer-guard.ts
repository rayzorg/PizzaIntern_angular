import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Auth } from './services/auth';

export const customerGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.role$.pipe(
    map(role => {
      if (role === 'CUSTOMER') {
        return true; 
      } else {
        return router.createUrlTree(['/']);
      }
    })
  );
};
