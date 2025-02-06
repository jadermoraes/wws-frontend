import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

export const isAdminGuard = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const toastService = inject(ToastService);

  const token = sessionService.getToken();
  if (token) {
    sessionService.updateSession();
    try {
      const userRoles = sessionService.getRoles(); // Assuming this method exists
      if (userRoles.includes('admin')) {
        return true;
      } else {
        toastService.danger('You are not authorized to access this page');
        alert('You are not authorized to access this page');
        return router.createUrlTree(['/unauthorized']); // Redirect to an unauthorized page
      }
    } catch {
      return router.createUrlTree(['/login']);
    }
  } else {
    return router.createUrlTree(['/login']);
  }
};
