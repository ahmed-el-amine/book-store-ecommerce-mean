import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return router.parseUrl('/auth/login');
  }

  const requiredRoles = route.data['roles'] as Array<string>;
  if (requiredRoles && requiredRoles.length > 0) {
    return authService.getCurrentUser().pipe(
      map((currentUser: { role: string; }) => {
        if (!currentUser || !requiredRoles.includes(currentUser.role)) {
          return router.parseUrl('/');
        }
        return true;
      })
    );
  }

  return true;
};

export const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
