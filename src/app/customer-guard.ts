import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Auth } from './services/authService';

export const customerGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.role$.pipe(
    map((role) => {
      if (!role) {
        // Not logged in
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }

      if (role === 'CUSTOMER') {
        return true;
      }

      // Logged in, but wrong role
      return router.createUrlTree(['/access-denied']);
    }),
  );
};
