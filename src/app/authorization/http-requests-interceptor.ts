import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
  } from '@angular/common/http';
  import { Injectable, isDevMode } from '@angular/core';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { ToastService } from '../shared/components/toast/toast.service';

  import { SessionService } from './services/session.service';

  @Injectable({
    providedIn: 'root',
  })
  export class HttpRequestsInterceptor implements HttpInterceptor {
    constructor(
      private sessionService: SessionService,
      private toastService: ToastService
    ) {}

    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      let newReq;
      if (req.url.includes('assets/i18n/') || req.url.includes('maps.googleapis')) {
        return next.handle(req);
      }
      let token = this.sessionService.getToken();
      let preferredLanguage = this.sessionService.getUserLanguage();
      if (token) {
        newReq = req.clone({
          setHeaders: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': preferredLanguage,
          },
          url: this.sessionService.getUrl() + req.url,
        });
      } else {
        newReq = req.clone({
          setHeaders: {
            'Accept-Language': preferredLanguage,
          },
          url: this.sessionService.getUrl() + req.url,
        });
      }

      return next
      .handle(newReq || req)
      .pipe(
        catchError((error: HttpErrorResponse) => this.processError(req, error))
      );
    }

    private processError(req: HttpRequest<any>, error: HttpErrorResponse) {
      if (error.status === 504) {
        localStorage.setItem('timeout-url', window.location.href);
        window.location.href = window.location.origin + '/#/' + '504';
      } else if (error.status === 401) {
        if (req.url.includes('auth/token') || req.url.includes('login')) {
          return throwError(error);
        }

        this.sessionService.redirectToLogin();
        return new Observable<HttpEvent<any>>();
      } else if (error.status === 403) {
        this.toastService.danger(
          error.error.message
        );
        if (req.method === 'GET') {
          window.location.href = window.location.origin + '/#/' + '403';
        }
      } else if (error.status === 404) {
        window.location.href = window.location.origin + '/#/' + '404';
      }

      if (error.status === 0) {
        /* Canceled request / internet is down */
        return new Observable<HttpEvent<any>>();
      }

      return throwError(error);
    }
  }
