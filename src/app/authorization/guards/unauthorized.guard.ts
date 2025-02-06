import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const unauthorizedGuard = (): boolean | import('@angular/router').UrlTree => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  const token = sessionService.getToken();
  if (token) {
    // Redirect logged-in users to the dashboard or any other default page
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
