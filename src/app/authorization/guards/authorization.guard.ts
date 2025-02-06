import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

export const authorizationGuard = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  const token = sessionService.getToken();
  if (token) {
    sessionService.updateSession();
    try {
      return true;
    } catch {
      return router.createUrlTree(['/login']);
    }
  } else {
    return router.createUrlTree(['/login']);
  }
};
