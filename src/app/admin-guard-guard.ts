import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './services/auth';
import { map } from 'rxjs/operators';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.role$.pipe(
    map(role => {
      if (role === 'ADMIN') {
        return true; 
      } else if(role) {
        
        return router.createUrlTree(['/']);
      }else {
        return router.createUrlTree(['/login']);

      }
    })
  );
};
